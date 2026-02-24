/**
 * System Admin API – user management and integration.
 * All requests that require auth should send the Bearer token (see getAuthHeaders).
 */

import { getBackendBaseUrl } from "./api-config";
import { getStoredToken } from "./auth-api";

const BASE = getBackendBaseUrl();
const API = `${BASE.replace(/\/$/, "")}/api`;

/** Headers including auth token for authenticated API calls. */
function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? getStoredToken() : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// --- User list types & API ---

export interface SystemAdminUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  lastUpdated: string;
  contact: string;
  email: string;
}

export interface UserListFilters {
  role?: string;
  search?: string;
}

/** In-memory cache for default user list (no filters). Used by preload so User List page shows instantly. */
let cachedUserList: SystemAdminUser[] | null = null;

/** Get cached user list if preloaded (default filters only). */
export function getCachedUserList(): SystemAdminUser[] | null {
  return cachedUserList;
}

/** Preload user list in background (default filters). Call when dashboard loads for system-admin to make User List open instantly. */
export function preloadUserList(): void {
  fetchUserList({}).then((data) => {
    cachedUserList = data;
  });
}

/** Clear user list cache (e.g. after create/update/delete so next load is fresh). */
export function clearUserListCache(): void {
  cachedUserList = null;
}

/** Fetch user list from backend. GET /system-admin/users (or your backend route). Returns [] on error so UI can degrade gracefully. */
export async function fetchUserList(
  filters?: UserListFilters
): Promise<SystemAdminUser[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.role) params.set("role", filters.role);
    if (filters?.search) params.set("search", filters.search);
    const qs = params.toString();
    const url = qs ? `${API}/system-admin/users?${qs}` : `${API}/system-admin/users`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.users ?? data.data ?? [];
    if (!qs) cachedUserList = list;
    return list;
  } catch {
    return [];
  }
}

/** Export users (e.g. CSV). Wire to GET /api/system-admin/users/export. */
export async function exportUsers(
  filters?: UserListFilters
): Promise<Blob | void> {
  // When backend is ready:
  // const params = new URLSearchParams(filters as Record<string, string>);
  // const res = await fetch(`${BASE}/system-admin/users/export?${params}`);
  // if (!res.ok) throw new Error("Failed to export");
  // return res.blob();
  return undefined;
}

/** Payload for creating a new user. Match your backend schema. */
export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  role: string;
  /** Initial password for the new user (required when backend is connected). */
  password?: string;
}

/** Payload for updating an existing user. */
export interface UpdateUserPayload extends CreateUserPayload {
  id: string;
}

/** Create a new user. POST /system-admin/users. User is stored in DB with hashed password. */
export async function createUser(
  payload: CreateUserPayload
): Promise<{ success: boolean; data?: SystemAdminUser; message?: string }> {
  const res = await fetch(`${API}/system-admin/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok) {
    const user = data.user ?? data.data;
    return { success: true, data: user, message: data.message };
  }
  return {
    success: false,
    message: data.message ?? data.error ?? (res.status === 401 ? "Unauthorized" : "Failed to create user"),
  };
}

/** Update an existing user. PATCH /system-admin/users/:id. */
export async function updateUser(
  payload: UpdateUserPayload
): Promise<{ success: boolean; data?: SystemAdminUser; message?: string }> {
  const { id, ...body } = payload;
  const res = await fetch(`${API}/system-admin/users/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok) {
    const user = data.user ?? data.data;
    return { success: true, data: user, message: data.message };
  }
  return {
    success: false,
    message: data.message ?? data.error ?? (res.status === 401 ? "Unauthorized" : "Failed to update user"),
  };
}

/** Delete a user. DELETE /system-admin/users/:id. Removes user from DB. */
export async function deleteUser(
  id: string | number
): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`${API}/system-admin/users/${String(id)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok) return { success: true };
  return {
    success: false,
    message: data.message ?? data.error ?? (res.status === 404 ? "User not found" : "Failed to delete user"),
  };
}

// --- Application integration (database) types & API ---

export interface DatabaseConfig {
  host: string;
  port: string;
  databaseName: string;
  username: string;
  password: string;
}

export interface TestConnectionResult {
  success: boolean;
  message?: string;
}

const INTEGRATION = `${API}/system-admin/integration`;

/** Fetch current database config from backend. GET /api/system-admin/integration/database. Returns null on error or 404. */
export async function fetchDatabaseConfig(): Promise<DatabaseConfig | null> {
  try {
    const res = await fetch(`${INTEGRATION}/database`, { headers: getAuthHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    const raw = data.data ?? data.config ?? data;
    return {
      host: String(raw.host ?? ""),
      port: String(raw.port ?? ""),
      databaseName: String(raw.databaseName ?? raw.database_name ?? ""),
      username: String(raw.username ?? ""),
      password: String(raw.password ?? ""),
    };
  } catch {
    return null;
  }
}

/** Test database connection. POST /api/system-admin/integration/database/test. */
export async function testDatabaseConnection(
  config: DatabaseConfig
): Promise<TestConnectionResult> {
  try {
    const res = await fetch(`${INTEGRATION}/database/test`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(config),
    });
    const data = await res.json().catch(() => ({}));
    const message = data.message ?? data.error ?? (res.ok ? "Connection successful" : "Connection failed");
    return { success: res.ok, message };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Network error",
    };
  }
}

/** Save database config. PUT /api/system-admin/integration/database. */
export async function saveDatabaseConfig(
  config: DatabaseConfig
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${INTEGRATION}/database`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(config),
    });
    const data = await res.json().catch(() => ({}));
    const message = data.message ?? data.error ?? (res.ok ? "Configuration saved" : "Save failed");
    return { success: res.ok, message };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Network error",
    };
  }
}

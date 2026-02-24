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
    return Array.isArray(data) ? data : data.users ?? data.data ?? [];
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

/** Test database connection. Wire to POST /api/system-admin/integration/database/test. */
export async function testDatabaseConnection(
  config: DatabaseConfig
): Promise<TestConnectionResult> {
  // When backend is ready:
  // const res = await fetch(`${BASE}/system-admin/integration/database/test`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(config),
  // });
  // const data = await res.json();
  // return { success: res.ok, message: data.message };
  return {
    success: false,
    message: "Backend not connected. Wire testDatabaseConnection in src/lib/system-admin-api.ts",
  };
}

/** Save database config. Wire to POST /api/system-admin/integration/database. */
export async function saveDatabaseConfig(
  config: DatabaseConfig
): Promise<{ success: boolean; message?: string }> {
  // When backend is ready:
  // const res = await fetch(`${BASE}/system-admin/integration/database`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(config),
  // });
  // const data = await res.json();
  // return { success: res.ok, message: data.message };
  return {
    success: false,
    message: "Backend not connected. Wire saveDatabaseConfig in src/lib/system-admin-api.ts",
  };
}

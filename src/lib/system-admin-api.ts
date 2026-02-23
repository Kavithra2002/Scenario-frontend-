/**
 * System Admin API – backend-ready hooks.
 * Replace the stub implementations with real fetch/API calls when the backend is ready.
 */

import { getBackendBaseUrl } from "./api-config";

const BASE = getBackendBaseUrl();

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

/** Fetch user list from backend. Wire to GET /api/system-admin/users (or your backend route). */
export async function fetchUserList(
  filters?: UserListFilters
): Promise<SystemAdminUser[]> {
  // When backend is ready:
  // const params = new URLSearchParams(filters as Record<string, string>);
  // const res = await fetch(`${BASE}/system-admin/users?${params}`);
  // if (!res.ok) throw new Error("Failed to fetch users");
  // return res.json();
  return [];
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
}

/** Payload for updating an existing user. */
export interface UpdateUserPayload extends CreateUserPayload {
  id: string;
}

/** Create a new user. Wire to POST /api/system-admin/users. */
export async function createUser(
  payload: CreateUserPayload
): Promise<{ success: boolean; data?: SystemAdminUser; message?: string }> {
  // When backend is ready:
  // const res = await fetch(`${BASE}/system-admin/users`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // const data = await res.json();
  // return { success: res.ok, data: data.user, message: data.message };
  return {
    success: false,
    message:
      "Backend not connected. Wire createUser in src/lib/system-admin-api.ts",
  };
}

/** Update an existing user. Wire to PATCH /api/system-admin/users/:id. */
export async function updateUser(
  payload: UpdateUserPayload
): Promise<{ success: boolean; data?: SystemAdminUser; message?: string }> {
  // When backend is ready:
  // const res = await fetch(`${BASE}/system-admin/users/${payload.id}`, {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // const data = await res.json();
  // return { success: res.ok, data: data.user, message: data.message };
  return {
    success: false,
    message:
      "Backend not connected. Wire updateUser in src/lib/system-admin-api.ts",
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

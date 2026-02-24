/**
 * Auth API – login, current user, and token handling.
 * Backend exposes: POST /api/auth/login, GET /api/auth/me (Bearer token).
 */

import { getBackendBaseUrl } from "./api-config";

const BASE = getBackendBaseUrl();
const API = `${BASE.replace(/\/$/, "")}/api`;

export type AuthUser = {
  id: string;
  email: string;
  role: "user" | "admin" | "system-admin" | "authorizer";
  firstName?: string;
  lastName?: string;
};

const AUTH_TOKEN_KEY = "app-auth-token";

/** Get stored access token (client-only). */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/** Store access token (client-only). */
export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/** Remove stored token (client-only). */
export function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export type LoginResponse = {
  ok: true;
  accessToken: string;
  user: AuthUser;
};

export type LoginError = {
  ok: false;
  error: string;
};

/**
 * Log in with email and password.
 * Backend: POST /auth/login  body: { email, password }
 * Response: { accessToken, user: { id, email, role, firstName?, lastName? } }
 */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse | LoginError> {
  const trimmed = email.trim();
  if (!trimmed) return { ok: false, error: "Email is required" };
  if (!password) return { ok: false, error: "Password is required" };

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmed, password }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message =
        data.message ?? data.error ?? (res.status === 401 ? "Invalid email or password" : "Login failed");
      return { ok: false, error: message };
    }

    const accessToken = data.accessToken ?? data.token;
    const user = data.user;
    if (!accessToken || !user?.email) {
      return { ok: false, error: "Invalid response from server" };
    }

    const authUser: AuthUser = {
      id: String(user.id ?? ""),
      email: user.email,
      role: ["user", "admin", "system-admin", "authorizer"].includes(user.role) ? user.role : "user",
      firstName: user.firstName,
      lastName: user.lastName,
    };
    setStoredToken(accessToken);
    return { ok: true, accessToken, user: authUser };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: message };
  }
}

export type MeResponse = {
  ok: true;
  user: AuthUser;
};

export type MeError = {
  ok: false;
  error: string;
};

/**
 * Get current user from backend using stored token.
 * Backend: GET /api/auth/me  headers: Authorization: Bearer <token>
 * Response: { user: { id, email, role, ... } }
 */
export async function getMe(): Promise<MeResponse | MeError> {
  const token = getStoredToken();
  if (!token) return { ok: false, error: "Not authenticated" };

  try {
    const res = await fetch(`${API}/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      clearStoredToken();
      return { ok: false, error: "Session expired" };
    }
    if (!res.ok) {
      return { ok: false, error: data.message ?? data.error ?? "Failed to load user" };
    }

    const user = data.user;
    if (!user?.email) return { ok: false, error: "Invalid response from server" };

    const authUser: AuthUser = {
      id: String(user.id ?? ""),
      email: user.email,
      role: ["user", "admin", "system-admin", "authorizer"].includes(user.role) ? user.role : "user",
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return { ok: true, user: authUser };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: message };
  }
}

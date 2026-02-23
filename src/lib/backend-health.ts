/**
 * Backend health check. Pings the backend /health or /api/health endpoint.
 */

import { getBackendBaseUrl } from "./api-config";

export type HealthCheckResult = {
  ok: boolean;
  message?: string;
  status?: number;
};

/**
 * Check if the backend is reachable. Tries /health then /api/health.
 * Safe to call from server (e.g. instrumentation) or client.
 */
export async function checkBackendHealth(): Promise<HealthCheckResult> {
  const base = getBackendBaseUrl();
  const baseClean = base.replace(/\/$/, "");
  const urlsToTry = [
    baseClean,
    `${baseClean}/health`,
    `${baseClean}/api/health`,
    `${baseClean}/healthz`,
    `${baseClean}/ping`,
    `${baseClean}/ready`,
    `${baseClean}/status`,
  ];

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        return { ok: true, status: res.status };
      }
      return {
        ok: false,
        status: res.status,
        message: `Backend returned ${res.status}`,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("abort") || message.includes("timeout")) {
        continue;
      }
      return { ok: false, message };
    }
  }

  return {
    ok: false,
    message: "Backend not reachable (tried /health and /api/health)",
  };
}

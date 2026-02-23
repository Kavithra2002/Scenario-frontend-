/**
 * Backend API base URL. Set NEXT_PUBLIC_API_BASE in .env (e.g. http://localhost:3001).
 * When unset, defaults to "/api" (Next.js rewrites or same-origin API routes).
 */
export const getBackendBaseUrl = (): string =>
  process.env.NEXT_PUBLIC_API_BASE ?? "/api";

import { NextResponse } from "next/server";
import { checkBackendHealth } from "@/lib/backend-health";

/**
 * GET /api/health – returns backend connection status (for UI or monitoring).
 */
export async function GET() {
  const result = await checkBackendHealth();
  return NextResponse.json(
    {
      backend: result.ok ? "connected" : "disconnected",
      ok: result.ok,
      message: result.message,
    },
    { status: result.ok ? 200 : 503 }
  );
}

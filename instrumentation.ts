/**
 * Runs when the Next.js server starts. Logs backend connection status to the terminal.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { checkBackendHealth } = await import("./src/lib/backend-health");
  const { getBackendBaseUrl } = await import("./src/lib/api-config");

  const base = getBackendBaseUrl();
  const result = await checkBackendHealth();

  if (result.ok) {
    console.log("\n  \x1b[32m✓ Backend is connected\x1b[0m", `(${base})\n`);
  } else {
    console.log(
      "\n  \x1b[33m○ Backend is not connected\x1b[0m",
      result.message ? `– ${result.message}` : "",
      `(${base})\n`
    );
  }
}

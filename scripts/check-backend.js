const fs = require("fs");
const path = require("path");

// Load .env from project root
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eq = trimmed.indexOf("=");
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim();
        const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
        process.env[key] = value;
      }
    }
  }
}

const base = (process.env.NEXT_PUBLIC_API_BASE || "/api").replace(/\/$/, "");
const urlsToTry = [
  base,
  `${base}/health`,
  `${base}/api/health`,
  `${base}/healthz`,
  `${base}/ping`,
  `${base}/ready`,
  `${base}/status`,
];

async function check() {
  let lastError = "";
  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        console.log("\n  \x1b[32m✓ Backend is connected\x1b[0m\n");
        return;
      }
      lastError = `HTTP ${res.status} at ${url}`;
    } catch (err) {
      lastError = err.cause?.code === "ECONNREFUSED"
        ? `Connection refused to ${url} (is backend running on this port?)`
        : err.message || String(err);
    }
  }
  console.log("\n  \x1b[33m○ Backend is not connected\x1b[0m");
  if (lastError) console.log("  \x1b[90m" + lastError + "\x1b[0m");
  console.log("");
}

check().then(() => process.exit(0));

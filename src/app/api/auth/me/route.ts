import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { verifyToken, getBearerToken } from "@/lib/auth-server";

const VALID_ROLES = ["user", "admin", "system-admin", "authorizer"] as const;

export async function GET(request: Request) {
  if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 503 }
    );
  }
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const pool = getPool();
    const result = await pool.query<{
      id: number;
      email: string;
      name: string | null;
      role: string;
    }>("SELECT id, email, name, role FROM users WHERE id = $1", [payload.sub]);
    const row = result.rows[0];
    if (!row) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    const role = VALID_ROLES.includes(row.role as (typeof VALID_ROLES)[number])
      ? row.role
      : "user";
    const nameParts = row.name?.trim().split(/\s+/) ?? [];
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") ?? "";
    return NextResponse.json({
      user: {
        id: String(row.id),
        email: row.email,
        role,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      },
    });
  } catch (err) {
    console.error("Me error:", err);
    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    );
  }
}

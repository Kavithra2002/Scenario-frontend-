import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth-server";

const VALID_ROLES = ["user", "admin", "system-admin", "authorizer"] as const;

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 503 }
    );
  }
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }
  try {
    const pool = getPool();
    const result = await pool.query<{
      id: number;
      email: string;
      password_hash: string;
      name: string | null;
      role: string;
    }>(
      "SELECT id, email, password_hash, name, role FROM users WHERE email = $1",
      [email.toLowerCase()]
    );
    const row = result.rows[0];
    if (!row || !(await verifyPassword(password, row.password_hash))) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
    const role = VALID_ROLES.includes(row.role as (typeof VALID_ROLES)[number])
      ? row.role
      : "user";
    const accessToken = await signToken({
      sub: String(row.id),
      email: row.email,
      role,
    });
    const nameParts = row.name?.trim().split(/\s+/) ?? [];
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") ?? "";
    return NextResponse.json({
      accessToken,
      user: {
        id: String(row.id),
        email: row.email,
        role,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}

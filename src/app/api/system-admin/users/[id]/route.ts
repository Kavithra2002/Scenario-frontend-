import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getBearerToken, verifyToken } from "@/lib/auth-server";

const VALID_ROLES = ["user", "admin", "system-admin", "authorizer"] as const;

async function requireSystemAdmin(request: Request): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  const token = getBearerToken(request);
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
  if (payload.role !== "system-admin") {
    return {
      ok: false,
      response: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }
  return { ok: true };
}

/** PATCH /api/system-admin/users/:id – update user (system-admin only). */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 503 }
    );
  }
  const auth = await requireSystemAdmin(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const userId = parseInt(id, 10);
  if (Number.isNaN(userId) || userId < 1) {
    return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
  }
  let body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    contact?: string;
    role?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : undefined;
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : undefined;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : undefined;
  const role =
    typeof body.role === "string" && VALID_ROLES.includes(body.role as (typeof VALID_ROLES)[number])
      ? body.role
      : undefined;
  if (!firstName && !lastName && email === undefined && role === undefined) {
    return NextResponse.json({ message: "No fields to update" }, { status: 400 });
  }
  try {
    const pool = getPool();
    const updates: string[] = [];
    const values: (string | number)[] = [];
    let i = 1;
    if (firstName !== undefined || lastName !== undefined) {
      const name = [firstName ?? "", lastName ?? ""].filter(Boolean).join(" ") || null;
      updates.push(`name = $${i}`);
      values.push(name);
      i++;
    }
    if (email !== undefined) {
      updates.push(`email = $${i}`);
      values.push(email);
      i++;
    }
    if (role !== undefined) {
      updates.push(`role = $${i}`);
      values.push(role);
      i++;
    }
    updates.push(`updated_at = now()`);
    values.push(userId);
    const result = await pool.query<{
      id: number;
      email: string;
      name: string | null;
      role: string;
      updated_at: Date;
    }>(
      `UPDATE users SET ${updates.join(", ")} WHERE id = $${i} RETURNING id, email, name, role, updated_at`,
      values
    );
    const row = result.rows[0];
    if (!row) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const nameParts = row.name?.trim().split(/\s+/) ?? [];
    const user = {
      id: String(row.id),
      firstName: nameParts[0] ?? "",
      lastName: nameParts.slice(1).join(" ") ?? "",
      email: row.email,
      contact: "",
      role: row.role,
      lastUpdated: new Date(row.updated_at).toISOString(),
    };
    return NextResponse.json({ user });
  } catch (err) {
    console.error("Update user error:", err);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { hashPassword, getBearerToken, verifyToken } from "@/lib/auth-server";

const VALID_ROLES = ["user", "admin", "system-admin", "authorizer"] as const;

function requireSystemAdmin(request: Request): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  const token = getBearerToken(request);
  if (!token) {
    return Promise.resolve({
      ok: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    });
  }
  return verifyToken(token).then((payload) => {
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
  });
}

/** GET /api/system-admin/users – list users (system-admin only). */
export async function GET(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 503 }
    );
  }
  const auth = await requireSystemAdmin(request);
  if (!auth.ok) return auth.response;
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") ?? undefined;
  const search = searchParams.get("search")?.trim();
  try {
    const pool = getPool();
    let query = "SELECT id, email, name, role, created_at, updated_at FROM users WHERE 1=1";
    const params: (string | number)[] = [];
    let i = 1;
    if (role) {
      query += ` AND role = $${i}`;
      params.push(role);
      i++;
    }
    if (search) {
      query += ` AND (email ILIKE $${i} OR name ILIKE $${i})`;
      params.push(`%${search}%`);
    }
    query += " ORDER BY created_at DESC";
    const result = await pool.query(query, params);
    const users = result.rows.map((row) => {
      const nameParts = row.name?.trim().split(/\s+/) ?? [];
      const firstName = nameParts[0] ?? "";
      const lastName = nameParts.slice(1).join(" ") ?? "";
      return {
        id: String(row.id),
        email: row.email,
        firstName,
        lastName,
        role: row.role,
        contact: "", // DB has no contact column
        lastUpdated: row.updated_at ? new Date(row.updated_at).toISOString() : new Date(row.created_at).toISOString(),
      };
    });
    return NextResponse.json(users);
  } catch (err) {
    console.error("List users error:", err);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/** POST /api/system-admin/users – create user (system-admin only). */
export async function POST(request: Request) {
  if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 503 }
    );
  }
  const auth = await requireSystemAdmin(request);
  if (!auth.ok) return auth.response;
  let body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    contact?: string;
    role?: string;
    password?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
  const role = typeof body.role === "string" && VALID_ROLES.includes(body.role as (typeof VALID_ROLES)[number])
    ? body.role
    : "user";
  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }
  if (!password || password.length < 6) {
    return NextResponse.json(
      { message: "Password is required and must be at least 6 characters" },
      { status: 400 }
    );
  }
  const name = [firstName, lastName].filter(Boolean).join(" ") || null;
  try {
    const pool = getPool();
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { message: "A user with this email already exists" },
        { status: 409 }
      );
    }
    const password_hash = await hashPassword(password);
    const result = await pool.query<{ id: number; email: string; name: string | null; role: string; created_at: Date }>(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role, created_at`,
      [email, password_hash, name, role]
    );
    const row = result.rows[0];
    if (!row) {
      return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
    }
    const nameParts = row.name?.trim().split(/\s+/) ?? [];
    const user = {
      id: String(row.id),
      firstName: nameParts[0] ?? "",
      lastName: nameParts.slice(1).join(" ") ?? "",
      email: row.email,
      contact: "",
      role: row.role,
      lastUpdated: new Date(row.created_at).toISOString(),
    };
    return NextResponse.json({ user });
  } catch (err) {
    console.error("Create user error:", err);
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}

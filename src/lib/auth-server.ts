/**
 * Server-only auth helpers: password hashing and JWT.
 * Do not import in client components.
 */

import bcrypt from "bcryptjs";
import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET ?? "change-me-in-production";
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: { sub: string; email: string; role: string }): Promise<string> {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<{ sub: string; email: string; role: string } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    const sub = payload.sub as string;
    const email = payload.email as string;
    const role = payload.role as string;
    if (!sub || !email || !role) return null;
    return { sub, email, role };
  } catch {
    return null;
  }
}

export function getBearerToken(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

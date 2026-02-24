/**
 * PostgreSQL connection for API routes.
 * Set DATABASE_URL in .env (e.g. postgresql://user:password@localhost:5432/postgres).
 */

import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

function createPool(): Pool {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
  });
}

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

export interface DbUser {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  role: string;
  created_at: Date;
  updated_at: Date | null;
}

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  sql?: ReturnType<typeof postgres>;
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

let prodDb: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (globalForDb.db) {
    return globalForDb.db;
  }
  if (prodDb) {
    return prodDb;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql =
    globalForDb.sql ??
    postgres(connectionString, {
      max: 10,
      prepare: false,
    });
  const db = drizzle(sql, { schema });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.sql = sql;
    globalForDb.db = db;
    return db;
  }

  prodDb = db;
  return db;
}

export * from "./schema";

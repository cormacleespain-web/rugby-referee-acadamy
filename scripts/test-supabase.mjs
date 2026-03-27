/**
 * Tests Supabase Auth and Database connectivity using .env.local
 * Run: node --env-file=.env.local scripts/test-supabase.mjs
 * Or (Node 18): npx dotenv -e .env.local -- node scripts/test-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const dbUrl = process.env.DATABASE_URL;

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

if (!url || !key) {
  fail("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in env.");
}
if (!dbUrl) {
  fail("Missing DATABASE_URL in env.");
}

console.log("Testing Supabase connection...\n");

// Test Auth / API
try {
  const supabase = createClient(url, key);
  const { error } = await supabase.auth.getSession();
  if (error) throw error;
  console.log("  Supabase Auth / API: OK");
} catch (e) {
  console.error("  Supabase Auth / API: FAIL");
  console.error("  ", e.message ?? e);
  process.exit(1);
}

// Test Database (direct Postgres)
try {
  const sql = postgres(dbUrl, { max: 1, connect_timeout: 10 });
  await sql`SELECT 1`;
  await sql.end();
  console.log("  Database (Postgres): OK");
} catch (e) {
  console.error("  Database (Postgres): FAIL");
  console.error("  ", e.message ?? e);
  if (e.message && (e.message.includes("EHOSTUNREACH") || e.message.includes("5432"))) {
    console.error("\n  Tip: If using the 'Direct' connection, try the 'Connection pooling'");
    console.error("  URI from Supabase (Project Settings → Database), port 6543.");
  }
  process.exit(1);
}

console.log("\nAll Supabase checks passed.");

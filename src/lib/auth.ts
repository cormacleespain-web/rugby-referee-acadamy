import { createClient } from "@/lib/supabase/server";
import { getDb } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type UserRole = "referee" | "coach" | "admin";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  const db = getDb();
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);
  return profile ?? null;
}

export function requireAuth() {
  return getCurrentUser().then((user) => {
    if (!user) throw new Error("Unauthorized");
    return user;
  });
}

export function requireRole(allowedRoles: UserRole[]) {
  return getCurrentProfile().then((profile) => {
    if (!profile) throw new Error("Unauthorized");
    if (!allowedRoles.includes(profile.role as UserRole))
      throw new Error("Forbidden");
    return profile;
  });
}

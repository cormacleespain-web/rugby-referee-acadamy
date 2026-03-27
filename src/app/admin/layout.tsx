import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/auth/actions";
import { NavLink } from "@/components/layout/nav-link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let profile: { role: string } | null = null;
  try {
    const db = getDb();
    const [p] = await db
      .select({ role: profiles.role })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);
    profile = p ?? null;
  } catch {
    redirect("/dashboard");
  }

  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-14 items-center justify-between px-4">
          <nav className="flex items-center gap-6">
            <NavLink href="/admin">
              Admin
            </NavLink>
            <NavLink
              href="/admin/submissions"
              className="text-sm"
              matchPrefix
            >
              Submissions
            </NavLink>
            <NavLink
              href="/admin/users"
              className="text-sm"
              matchPrefix
            >
              Users
            </NavLink>
            <NavLink
              href="/admin/coaches"
              className="text-sm"
              matchPrefix
            >
              Coaches
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{user.email}</span>
            <form action={logout}>
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main id="main-content" className="container py-6 px-4">
        {children}
      </main>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/auth/actions";
import { NavLink } from "@/components/layout/nav-link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-14 items-center justify-between px-4">
          <nav className="flex items-center gap-6">
            <NavLink href="/dashboard">
              Dashboard
            </NavLink>
            <NavLink href="/dashboard/submissions" matchPrefix>
              Submissions
            </NavLink>
            <NavLink href="/dashboard/reports" matchPrefix>
              Reports
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

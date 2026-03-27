import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/layout/nav-link";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-primary/20 bg-primary/5">
        <div className="container px-4 py-2.5 sm:px-6">
          <p className="text-center text-sm font-medium text-primary">
            Demo mode — no Supabase required. This is what the app looks like when logged in.
          </p>
        </div>
      </div>
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <nav className="flex items-center gap-6" aria-label="Demo">
            <Link href="/demo" className="flex items-center gap-2 font-semibold text-foreground shrink-0">
              <Image src="/logo.svg" alt="" width={24} height={24} className="h-6 w-auto object-contain" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <div className="flex items-center gap-1">
              <NavLink href="/demo/submissions" matchPrefix className="text-sm px-3 py-2 rounded-md transition-colors">
                Submissions
              </NavLink>
              <NavLink href="/demo/reports" matchPrefix className="text-sm px-3 py-2 rounded-md transition-colors">
                Reports
              </NavLink>
            </div>
          </nav>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="font-medium">Demo user</Badge>
            <span className="text-muted-foreground text-sm hidden sm:inline">demo@refereeacademy.com</span>
            <Link
              href="/"
              className="inline-flex h-7 items-center justify-center rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Back to site
            </Link>
          </div>
        </div>
      </header>
      <main id="main-content" className="container py-8 px-4 sm:px-6">
        {children}
      </main>
    </div>
  );
}

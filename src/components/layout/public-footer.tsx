import Link from "next/link";
import Image from "next/image";

const socialLinks = [
  { name: "YouTube", href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE },
  { name: "Instagram", href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM },
  { name: "TikTok", href: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK },
  { name: "Facebook", href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK },
  { name: "LinkedIn", href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN },
].filter((link): link is { name: string; href: string } => Boolean(link.href));

export function PublicFooter() {
  return (
    <footer className="w-full min-w-0 border-t border-border bg-muted/40">
      <div className="container px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          <div className="space-y-4">
            <Link
              href="/"
              aria-label="Rugby Refereeing Academy – Home"
              className="inline-flex items-center hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            >
              <Image src="/logo.svg" alt="" width={28} height={28} className="h-7 w-auto object-contain" />
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Professional match review and coaching for rugby referees, by referees.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { href: "/about", label: "About" },
                { href: "/team", label: "Team" },
                { href: "/pricing", label: "Pricing" },
                { href: "/youth", label: "Youth Initiatives" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
                { href: "/trust", label: "Trust & safeguarding" },
                { href: "/demo", label: "View demo (logged-in preview)" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Follow us</h3>
            {socialLinks.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-4 text-sm">
                {socialLinks.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground mt-4 text-sm">
                Social channels launching soon.
              </p>
            )}
          </div>
        </div>
        <p className="text-muted-foreground mt-12 pt-8 border-t border-border text-center text-sm">
          © {new Date().getFullYear()} Rugby Refereeing Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

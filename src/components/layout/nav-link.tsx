"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

type Props = LinkProps &
  Omit<ComponentPropsWithoutRef<"a">, "href"> & {
    matchPrefix?: boolean;
  };

export function NavLink({
  href,
  className,
  matchPrefix = false,
  ...props
}: Props) {
  const pathname = usePathname();
  const hrefValue = typeof href === "string" ? href : href.toString();
  const isActive = matchPrefix ? pathname.startsWith(hrefValue) : pathname === hrefValue;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`${isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"} ${className ?? ""}`}
      {...props}
    />
  );
}

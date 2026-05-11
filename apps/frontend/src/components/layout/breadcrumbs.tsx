"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { pathLabels } from "@/config/nav";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  className?: string;
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  let currentPath = "";

  const crumbs = segments.map((segment) => {
    currentPath += `/${segment}`;
    return {
      href: currentPath,
      label: pathLabels[currentPath] ?? segment.replace(/-/g, " "),
    };
  });

  return (
    <nav
      className={cn(
        "flex items-center gap-2 text-xs text-muted-foreground",
        className,
      )}
    >
      <Link href="/" className="transition-colors hover:text-foreground">
        Home
      </Link>
      {crumbs.map((crumb, index) => (
        <span key={crumb.href} className="flex items-center gap-2">
          <span className="text-muted-foreground/60">/</span>
          {index === crumbs.length - 1 ? (
            <span className="text-foreground">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="transition-colors hover:text-foreground"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

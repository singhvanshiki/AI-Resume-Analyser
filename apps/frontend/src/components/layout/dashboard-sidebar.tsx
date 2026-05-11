"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/layout/brand";
import type { NavSection } from "@/config/nav";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  navSections: NavSection[];
  homeHref: string;
}

export function DashboardSidebar({
  navSections,
  homeHref,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-border/60 bg-background/70 px-4 pb-8 pt-6 lg:flex">
      <BrandLogo href={homeHref} />
      <div className="mt-10 space-y-6">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {section.title}
            </p>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

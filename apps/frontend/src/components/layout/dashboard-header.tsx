"use client";

import { Bell } from "lucide-react";
import { GlobalSearch } from "@/components/common/global-search";
import { NotificationsMenu } from "@/components/common/notifications-menu";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { UserMenu } from "@/components/common/user-menu";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import type { NavSection } from "@/config/nav";

interface DashboardHeaderProps {
  navSections: NavSection[];
  homeHref: string;
}

export function DashboardHeader({
  navSections,
  homeHref,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex w-full flex-col gap-3 border-b border-border/60 bg-background/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 lg:hidden">
          <MobileNav navSections={navSections} homeHref={homeHref} />
        </div>
        <div className="hidden flex-1 lg:block">
          <Breadcrumbs />
        </div>
        <div className="flex items-center gap-2">
          <GlobalSearch className="hidden md:flex" />
          <NotificationsMenu>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
          </NotificationsMenu>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
      <div className="lg:hidden">
        <Breadcrumbs />
      </div>
    </header>
  );
}

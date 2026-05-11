"use client";

import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import type { NavSection } from "@/config/nav";

interface DashboardShellProps {
  navSections: NavSection[];
  homeHref: string;
  children: ReactNode;
}

export function DashboardShell({
  navSections,
  homeHref,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar navSections={navSections} homeHref={homeHref} />
      <div className="flex flex-1 flex-col">
        <DashboardHeader navSections={navSections} homeHref={homeHref} />
        <main className="flex-1 px-6 pb-12 pt-6">{children}</main>
      </div>
    </div>
  );
}

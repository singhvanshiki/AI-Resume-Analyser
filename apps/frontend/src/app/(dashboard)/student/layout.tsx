"use client";

import type { ReactNode } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { studentNavSections } from "@/config/nav";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["student", "admin"]}>
      <DashboardShell navSections={studentNavSections} homeHref="/student">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}

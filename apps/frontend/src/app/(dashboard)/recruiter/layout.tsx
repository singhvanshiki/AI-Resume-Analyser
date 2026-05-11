"use client";

import type { ReactNode } from "react";

import { RoleGuard } from "@/components/auth/role-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { recruiterNavSections } from "@/config/nav";

export default function RecruiterLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["recruiter", "admin"]}>
      <DashboardShell navSections={recruiterNavSections} homeHref="/recruiter">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}

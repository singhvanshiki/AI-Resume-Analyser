"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { LoadingBlock } from "@/components/common/loading-block";
import type { UserRole } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
  children: ReactNode;
}

export function RoleGuard({
  allowedRoles,
  redirectTo = "/login",
  children,
}: RoleGuardProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      if (accessToken) {
        return;
      }
      router.replace(redirectTo);
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      router.replace(user.role === "recruiter" ? "/recruiter" : "/student");
    }
  }, [accessToken, allowedRoles, hasHydrated, redirectTo, router, user]);

  if (!hasHydrated) {
    return <LoadingBlock message="Preparing your workspace" />;
  }

  if (!user) {
    if (accessToken) {
      return <LoadingBlock message="Loading your profile" />;
    }
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

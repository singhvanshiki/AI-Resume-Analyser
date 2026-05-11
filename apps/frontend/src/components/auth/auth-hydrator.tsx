"use client";

import { useEffect } from "react";

import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

export function AuthHydrator() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if (!hasHydrated || !accessToken) return;

    authApi
      .me()
      .then((user) => {
        setUser(user);
      })
      .catch(() => {
        clearAuth();
      });
  }, [accessToken, clearAuth, hasHydrated, setUser]);

  return null;
}

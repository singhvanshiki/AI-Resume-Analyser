import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { safeStorage } from "@/lib/storage";

export type ThemePreference = "system" | "light" | "dark";

interface UserProfile {
  title: string;
  location: string;
  company: string;
  bio: string;
}

interface UserPreferences {
  theme: ThemePreference;
  emailDigest: boolean;
  weeklySummary: boolean;
  autoAnalyze: boolean;
}

interface UserStore {
  profile: UserProfile;
  preferences: UserPreferences;
  updateProfile: (patch: Partial<UserProfile>) => void;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: {
        title: "",
        location: "",
        company: "",
        bio: "",
      },
      preferences: {
        theme: "system",
        emailDigest: true,
        weeklySummary: true,
        autoAnalyze: true,
      },
      updateProfile: (patch) =>
        set((state) => ({ profile: { ...state.profile, ...patch } })),
      updatePreferences: (patch) =>
        set((state) => ({
          preferences: { ...state.preferences, ...patch },
        })),
    }),
    {
      name: "ai-resume-user",
      storage: createJSONStorage(() => safeStorage),
    },
  ),
);

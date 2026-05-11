import { create } from "zustand";

interface DashboardState {
  selectedResumeId: string | null;
  selectedJobId: string | null;
  searchQuery: string;
  setSelectedResumeId: (id: string | null) => void;
  setSelectedJobId: (id: string | null) => void;
  setSearchQuery: (value: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedResumeId: null,
  selectedJobId: null,
  searchQuery: "",
  setSelectedResumeId: (id) => set({ selectedResumeId: id }),
  setSelectedJobId: (id) => set({ selectedJobId: id }),
  setSearchQuery: (value) => set({ searchQuery: value }),
}));

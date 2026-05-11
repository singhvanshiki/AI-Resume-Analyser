import { create } from "zustand";

import type {
  ATSResponse,
  ContentResponse,
  MatchResponse,
  RankingResponse,
  SkillResponse,
} from "@/lib/types";

interface AtsHistoryEntry {
  date: string;
  score: number;
}

interface AnalysisStore {
  ats: ATSResponse | null;
  match: MatchResponse | null;
  skills: SkillResponse | null;
  summary: ContentResponse | null;
  coverLetter: ContentResponse | null;
  questions: ContentResponse | null;
  rewrite: ContentResponse | null;
  ranking: RankingResponse | null;
  atsHistory: AtsHistoryEntry[];
  setAts: (value: ATSResponse | null) => void;
  addAtsHistory: (score: number) => void;
  setMatch: (value: MatchResponse | null) => void;
  setSkills: (value: SkillResponse | null) => void;
  setSummary: (value: ContentResponse | null) => void;
  setCoverLetter: (value: ContentResponse | null) => void;
  setQuestions: (value: ContentResponse | null) => void;
  setRewrite: (value: ContentResponse | null) => void;
  setRanking: (value: RankingResponse | null) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  ats: null,
  match: null,
  skills: null,
  summary: null,
  coverLetter: null,
  questions: null,
  rewrite: null,
  ranking: null,
  atsHistory: [],
  setAts: (value) => set({ ats: value }),
  addAtsHistory: (score) =>
    set((state) => {
      const next = {
        date: new Date().toISOString(),
        score,
      };
      const history = [next, ...state.atsHistory].slice(0, 10);
      return { atsHistory: history };
    }),
  setMatch: (value) => set({ match: value }),
  setSkills: (value) => set({ skills: value }),
  setSummary: (value) => set({ summary: value }),
  setCoverLetter: (value) => set({ coverLetter: value }),
  setQuestions: (value) => set({ questions: value }),
  setRewrite: (value) => set({ rewrite: value }),
  setRanking: (value) => set({ ranking: value }),
  reset: () =>
    set({
      ats: null,
      match: null,
      skills: null,
      summary: null,
      coverLetter: null,
      questions: null,
      rewrite: null,
      ranking: null,
      atsHistory: [],
    }),
}));

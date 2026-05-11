import { create } from "zustand";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadItem {
  id: string;
  fileName: string;
  progress: number;
  status: UploadStatus;
  error?: string;
}

interface UploadStore {
  uploads: UploadItem[];
  addUpload: (item: UploadItem) => void;
  updateUpload: (id: string, patch: Partial<UploadItem>) => void;
  removeUpload: (id: string) => void;
  clearUploads: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploads: [],
  addUpload: (item) => set((state) => ({ uploads: [item, ...state.uploads] })),
  updateUpload: (id, patch) =>
    set((state) => ({
      uploads: state.uploads.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    })),
  removeUpload: (id) =>
    set((state) => ({
      uploads: state.uploads.filter((item) => item.id !== id),
    })),
  clearUploads: () => set({ uploads: [] }),
}));

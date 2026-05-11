import { apiClient } from "@/lib/api/client";
import type { ResumeDetail, ResumeList, ResumeResponse } from "@/lib/types";

export async function uploadResume(
  file: File,
  onProgress?: (progress: number) => void,
) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post<ResumeResponse>(
    "/resumes/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        if (!event.total) return;
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress?.(percent);
      },
    },
  );
  return response.data;
}

export async function listResumes(page = 1, pageSize = 20) {
  const response = await apiClient.get<ResumeList>("/resumes", {
    params: { page, page_size: pageSize },
  });
  return response.data;
}

export async function getResume(resumeId: string) {
  const response = await apiClient.get<ResumeDetail>(`/resumes/${resumeId}`);
  return response.data;
}

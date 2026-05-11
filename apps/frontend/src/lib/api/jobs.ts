import { apiClient } from "@/lib/api/client";
import type {
  JobDescriptionCreate,
  JobDescriptionList,
  JobDescriptionResponse,
} from "@/lib/types";

export async function createJobDescription(payload: JobDescriptionCreate) {
  const response = await apiClient.post<JobDescriptionResponse>(
    "/job-descriptions",
    payload,
  );
  return response.data;
}

export async function listJobDescriptions(page = 1, pageSize = 20) {
  const response = await apiClient.get<JobDescriptionList>(
    "/job-descriptions",
    {
      params: { page, page_size: pageSize },
    },
  );
  return response.data;
}

import { apiClient } from "@/lib/api/client";
import type { CompareRequest, RankingResponse } from "@/lib/types";

export async function compareCandidates(payload: CompareRequest) {
  const response = await apiClient.post<RankingResponse>(
    "/ranking/compare",
    payload,
  );
  return response.data;
}

export async function listRankings(jobId: string) {
  const response = await apiClient.get<RankingResponse>(`/ranking/${jobId}`);
  return response.data;
}

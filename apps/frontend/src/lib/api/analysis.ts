import { apiClient } from "@/lib/api/client";
import type {
  ATSRequest,
  ATSResponse,
  ContentRequest,
  ContentResponse,
  MatchRequest,
  MatchResponse,
  SkillResponse,
} from "@/lib/types";

export async function runAtsAnalysis(payload: ATSRequest) {
  const response = await apiClient.post<ATSResponse>("/analysis/ats", payload);
  return response.data;
}

export async function runMatchAnalysis(payload: MatchRequest) {
  const response = await apiClient.post<MatchResponse>(
    "/analysis/match",
    payload,
  );
  return response.data;
}

export async function generateRewrite(payload: ContentRequest) {
  const response = await apiClient.post<ContentResponse>(
    "/analysis/rewrite",
    payload,
  );
  return response.data;
}

export async function generateInterviewQuestions(payload: ContentRequest) {
  const response = await apiClient.post<ContentResponse>(
    "/analysis/questions",
    payload,
  );
  return response.data;
}

export async function generateCoverLetter(payload: ContentRequest) {
  const response = await apiClient.post<ContentResponse>(
    "/analysis/cover-letter",
    payload,
  );
  return response.data;
}

export async function generateSummary(payload: ContentRequest) {
  const response = await apiClient.post<ContentResponse>(
    "/analysis/summary",
    payload,
  );
  return response.data;
}

export async function extractSkills(payload: ContentRequest) {
  const response = await apiClient.post<SkillResponse>(
    "/analysis/skills",
    payload,
  );
  return response.data;
}

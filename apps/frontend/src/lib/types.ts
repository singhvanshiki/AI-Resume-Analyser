export type UserRole = "student" | "recruiter" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

export interface ResumeResponse {
  id: string;
  original_filename: string;
  content_type: string;
  storage_path: string;
  created_at: string;
}

export interface ResumeDetail extends ResumeResponse {
  text: string;
  sections: Record<string, string>;
}

export interface ResumeList {
  items: ResumeResponse[];
  page: number;
  page_size: number;
}

export interface JobDescriptionCreate {
  title: string;
  company?: string | null;
  location?: string | null;
  description_text: string;
}

export interface JobDescriptionResponse {
  id: string;
  title: string;
  company?: string | null;
  location?: string | null;
  description_text: string;
  created_at: string;
}

export interface JobDescriptionList {
  items: JobDescriptionResponse[];
  page: number;
  page_size: number;
}

export interface ATSRequest {
  resume_id: string;
  job_description_id?: string | null;
  job_description_text?: string | null;
}

export interface ATSResponse {
  analysis_id: string;
  ats_score: number;
  category_scores: Record<string, number>;
  explanation: string;
  missing_skills: string[];
  recommendations: string[];
  semantic_similarity: number;
}

export interface MatchRequest {
  resume_id: string;
  job_description_id?: string | null;
  job_description_text?: string | null;
}

export interface MatchResponse {
  semantic_similarity: number;
  skill_matches: Array<Record<string, unknown>>;
  missing_skills: string[];
  strengths: string[];
  gaps: string[];
  overall_fit?: string | null;
}

export interface ContentRequest {
  resume_id: string;
  job_description_id?: string | null;
  job_description_text?: string | null;
}

export interface ContentResponse {
  content_id: string;
  content: string;
}

export interface SkillResponse {
  skills: string[];
}

export interface CompareRequest {
  job_description_id: string;
  resume_ids: string[];
}

export interface RankingItem {
  resume_id: string;
  score: number;
  rank: number;
  explanation: string;
}

export interface RankingResponse {
  job_description_id: string;
  rankings: RankingItem[];
}

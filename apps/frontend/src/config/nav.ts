import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ClipboardSignature,
  Download,
  FileSearch,
  FileText,
  Gauge,
  History,
  Layers,
  LayoutDashboard,
  ListChecks,
  MessagesSquare,
  Search,
  Settings,
  Sparkles,
  Upload,
  User,
  Users,
  Wand2,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const studentNavSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/student",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Uploads",
    items: [
      { title: "Upload Resume", href: "/student/upload-resume", icon: Upload },
      { title: "Upload JD", href: "/student/upload-jd", icon: FileText },
    ],
  },
  {
    title: "Insights",
    items: [
      { title: "ATS Score", href: "/student/ats-score", icon: Gauge },
      { title: "Resume Analysis", href: "/student/analysis", icon: FileSearch },
      { title: "Skill Gap", href: "/student/skill-gap", icon: ListChecks },
      {
        title: "Resume Suggestions",
        href: "/student/suggestions",
        icon: Wand2,
      },
      { title: "Resume Summary", href: "/student/summary", icon: Sparkles },
      {
        title: "Cover Letter",
        href: "/student/cover-letter",
        icon: ClipboardSignature,
      },
      {
        title: "Interview Questions",
        href: "/student/interview-questions",
        icon: MessagesSquare,
      },
    ],
  },
  {
    title: "Library",
    items: [
      { title: "Resume History", href: "/student/history", icon: History },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Profile", href: "/student/profile", icon: User },
      { title: "Settings", href: "/student/settings", icon: Settings },
    ],
  },
];

export const recruiterNavSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Recruiter Dashboard",
        href: "/recruiter",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Inputs",
    items: [
      {
        title: "Upload Resumes",
        href: "/recruiter/upload-resumes",
        icon: Upload,
      },
      { title: "Upload JD", href: "/recruiter/upload-jd", icon: FileText },
    ],
  },
  {
    title: "Ranking",
    items: [
      { title: "Candidate Ranking", href: "/recruiter/ranking", icon: Users },
      { title: "Comparison", href: "/recruiter/comparison", icon: Layers },
      { title: "Search Candidates", href: "/recruiter/search", icon: Search },
      {
        title: "Recruiter Analytics",
        href: "/recruiter/analytics",
        icon: BarChart3,
      },
      { title: "Export Results", href: "/recruiter/export", icon: Download },
    ],
  },
  {
    title: "Account",
    items: [{ title: "Settings", href: "/recruiter/settings", icon: Settings }],
  },
];

export const pathLabels: Record<string, string> = {
  "/student": "Overview",
  "/student/upload-resume": "Upload Resume",
  "/student/upload-jd": "Upload JD",
  "/student/ats-score": "ATS Score",
  "/student/analysis": "Resume Analysis",
  "/student/skill-gap": "Skill Gap",
  "/student/suggestions": "Resume Suggestions",
  "/student/summary": "Resume Summary",
  "/student/cover-letter": "Cover Letter",
  "/student/interview-questions": "Interview Questions",
  "/student/history": "Resume History",
  "/student/profile": "Profile",
  "/student/settings": "Settings",
  "/recruiter": "Recruiter Overview",
  "/recruiter/upload-resumes": "Upload Resumes",
  "/recruiter/upload-jd": "Upload JD",
  "/recruiter/ranking": "Candidate Ranking",
  "/recruiter/comparison": "Candidate Comparison",
  "/recruiter/search": "Search Candidates",
  "/recruiter/analytics": "Recruiter Analytics",
  "/recruiter/export": "Export Results",
  "/recruiter/settings": "Settings",
};

"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { TrendLine } from "@/components/charts/trend-line";
import { EmptyState } from "@/components/common/empty-state";
import { ResumeCard } from "@/components/common/resume-card";
import { StatsCard } from "@/components/common/stats-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listJobDescriptions } from "@/lib/api/jobs";
import { listResumes } from "@/lib/api/resumes";
import { formatScore } from "@/lib/format";
import { useAnalysisStore } from "@/stores/analysis-store";

export default function StudentOverviewPage() {
  const { data: resumes } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => listResumes(),
  });

  const { data: jobs } = useQuery({
    queryKey: ["job-descriptions"],
    queryFn: () => listJobDescriptions(),
  });

  const latestAts = useAnalysisStore((state) => state.ats);
  const atsHistory = useAnalysisStore((state) => state.atsHistory);

  const trendData = atsHistory.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    score: entry.score,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Student overview"
        description="Track your resume readiness and analyze performance across job descriptions."
        action={
          <Button asChild>
            <Link href="/student/upload-resume">Upload resume</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard label="Resumes" value={`${resumes?.items.length ?? 0}`} />
        <StatsCard
          label="Job descriptions"
          value={`${jobs?.items.length ?? 0}`}
        />
        <StatsCard
          label="Latest ATS score"
          value={latestAts ? formatScore(latestAts.ats_score) : "N/A"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>ATS trend</CardTitle>
          </CardHeader>
          <CardContent>
            {trendData.length ? (
              <TrendLine data={trendData} />
            ) : (
              <EmptyState
                title="No ATS trend yet"
                description="Run your first ATS analysis to see the trend here."
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent resumes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resumes?.items.length ? (
              resumes.items
                .slice(0, 3)
                .map((resume) => <ResumeCard key={resume.id} resume={resume} />)
            ) : (
              <EmptyState
                title="No resumes yet"
                description="Upload a resume to begin your analysis workflow."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

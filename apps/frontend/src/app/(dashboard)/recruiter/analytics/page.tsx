"use client";

import { useQuery } from "@tanstack/react-query";
import { ScoreBreakdown } from "@/components/charts/score-breakdown";
import { TrendLine } from "@/components/charts/trend-line";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listResumes } from "@/lib/api/resumes";
import { useAnalysisStore } from "@/stores/analysis-store";

export default function RecruiterAnalyticsPage() {
  const { data: resumes } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => listResumes(),
  });

  const ranking = useAnalysisStore((state) => state.ranking);
  const atsHistory = useAnalysisStore((state) => state.atsHistory);

  const distribution = ranking?.rankings?.length
    ? [
        {
          name: "Top",
          value: ranking.rankings.filter((r) => r.score >= 75).length,
        },
        {
          name: "Mid",
          value: ranking.rankings.filter((r) => r.score >= 55 && r.score < 75)
            .length,
        },
        {
          name: "Low",
          value: ranking.rankings.filter((r) => r.score < 55).length,
        },
      ]
    : [];

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
        title="Recruiter analytics"
        description="Track candidate volume and ranking distribution."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Candidate distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {distribution.length ? (
              <ScoreBreakdown data={distribution} />
            ) : (
              <EmptyState
                title="No ranking data"
                description="Run a candidate ranking to see distribution insights."
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ATS trend snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            {trendData.length ? (
              <TrendLine data={trendData} />
            ) : (
              <EmptyState
                title="No ATS history"
                description="ATS scores from candidate analyses will appear here."
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-foreground">
            {resumes?.items.length ?? 0}
          </p>
          <p className="text-sm text-muted-foreground">
            Candidates stored in your workspace.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

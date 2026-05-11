"use client";

import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/common/empty-state";
import { RankingTable } from "@/components/common/ranking-table";
import { StatsCard } from "@/components/common/stats-card";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listJobDescriptions } from "@/lib/api/jobs";
import { listResumes } from "@/lib/api/resumes";
import { useAnalysisStore } from "@/stores/analysis-store";

export default function RecruiterOverviewPage() {
  const { data: resumes } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => listResumes(),
  });

  const { data: jobs } = useQuery({
    queryKey: ["job-descriptions"],
    queryFn: () => listJobDescriptions(),
  });

  const ranking = useAnalysisStore((state) => state.ranking);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Recruiter overview"
        description="Monitor candidate readiness and ranking performance."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          label="Candidate resumes"
          value={`${resumes?.items.length ?? 0}`}
        />
        <StatsCard
          label="Open job descriptions"
          value={`${jobs?.items.length ?? 0}`}
        />
        <StatsCard
          label="Latest ranking score"
          value={ranking?.rankings?.[0]?.score?.toFixed(1) ?? "N/A"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest ranking snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          {ranking?.rankings?.length ? (
            <RankingTable data={ranking.rankings} />
          ) : (
            <EmptyState
              title="No rankings yet"
              description="Run a candidate ranking to see the results here."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

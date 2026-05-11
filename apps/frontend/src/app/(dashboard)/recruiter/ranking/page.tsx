"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/empty-state";
import { RankingForm } from "@/components/common/ranking-form";
import { RankingTable } from "@/components/common/ranking-table";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { compareCandidates } from "@/lib/api/ranking";
import { useAnalysisStore } from "@/stores/analysis-store";

export default function CandidateRankingPage() {
  const ranking = useAnalysisStore((state) => state.ranking);
  const setRanking = useAnalysisStore((state) => state.setRanking);

  const mutation = useMutation({
    mutationFn: compareCandidates,
    onSuccess: (data) => {
      setRanking(data);
      toast.success("Candidate ranking complete.");
    },
    onError: () => {
      toast.error("Unable to rank candidates.");
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Candidate ranking"
        description="Rank multiple candidates against a job description."
      />

      <RankingForm
        onSubmit={(jobId, resumeIds) =>
          mutation.mutate({ job_description_id: jobId, resume_ids: resumeIds })
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Ranking results</CardTitle>
        </CardHeader>
        <CardContent>
          {ranking?.rankings?.length ? (
            <RankingTable data={ranking.rankings} />
          ) : (
            <EmptyState
              title="No ranking yet"
              description="Submit a comparison to view ranked candidates."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

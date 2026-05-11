"use client";

import Link from "next/link";

import { CandidateComparison } from "@/components/common/candidate-comparison";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { useAnalysisStore } from "@/stores/analysis-store";

export default function CandidateComparisonPage() {
  const ranking = useAnalysisStore((state) => state.ranking);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Candidate comparison"
        description="Compare ranked candidates side-by-side with explanations."
        action={
          <Button asChild variant="outline">
            <Link href="/recruiter/ranking">Run ranking</Link>
          </Button>
        }
      />

      {ranking?.rankings?.length ? (
        <CandidateComparison rankings={ranking.rankings} />
      ) : (
        <EmptyState
          title="No comparison data"
          description="Run a candidate ranking to compare shortlisted resumes."
        />
      )}
    </div>
  );
}

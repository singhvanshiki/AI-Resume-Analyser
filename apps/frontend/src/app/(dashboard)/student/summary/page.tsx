"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AnalysisBlock } from "@/components/common/analysis-block";
import { AnalysisForm } from "@/components/common/analysis-form";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { generateSummary } from "@/lib/api/analysis";
import { useAnalysisStore } from "@/stores/analysis-store";

export default function ResumeSummaryPage() {
  const summary = useAnalysisStore((state) => state.summary);
  const setSummary = useAnalysisStore((state) => state.setSummary);

  const mutation = useMutation({
    mutationFn: generateSummary,
    onSuccess: (data) => {
      setSummary(data);
      toast.success("Summary generated.");
    },
    onError: () => {
      toast.error("Unable to generate summary.");
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resume summary"
        description="Generate a recruiter-ready summary of your resume."
      />

      <AnalysisForm
        onSubmit={(payload) => mutation.mutate(payload)}
        submitLabel={mutation.isPending ? "Generating..." : "Generate summary"}
      />

      {summary ? (
        <AnalysisBlock title="Summary" content={summary.content} />
      ) : (
        <EmptyState
          title="Generate a resume summary"
          description="Run summary generation to see the results here."
        />
      )}
    </div>
  );
}

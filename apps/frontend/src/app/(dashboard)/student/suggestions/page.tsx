"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AnalysisBlock } from "@/components/common/analysis-block";
import { AnalysisForm } from "@/components/common/analysis-form";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { generateRewrite } from "@/lib/api/analysis";
import { useAnalysisStore } from "@/stores/analysis-store";

export default function ResumeSuggestionsPage() {
  const rewrite = useAnalysisStore((state) => state.rewrite);
  const setRewrite = useAnalysisStore((state) => state.setRewrite);

  const mutation = useMutation({
    mutationFn: generateRewrite,
    onSuccess: (data) => {
      setRewrite(data);
      toast.success("Suggestions generated.");
    },
    onError: () => {
      toast.error("Unable to generate suggestions.");
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resume suggestions"
        description="Get AI-driven recommendations to refine your resume."
      />

      <AnalysisForm
        onSubmit={(payload) => mutation.mutate(payload)}
        submitLabel={
          mutation.isPending ? "Generating..." : "Generate suggestions"
        }
      />

      {rewrite ? (
        <AnalysisBlock title="Suggested rewrite" content={rewrite.content} />
      ) : (
        <EmptyState
          title="Generate resume suggestions"
          description="Run a rewrite to see AI-driven improvements."
        />
      )}
    </div>
  );
}

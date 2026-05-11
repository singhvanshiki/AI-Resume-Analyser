"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AnalysisBlock } from "@/components/common/analysis-block";
import { AnalysisForm } from "@/components/common/analysis-form";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { generateCoverLetter } from "@/lib/api/analysis";
import { useAnalysisStore } from "@/stores/analysis-store";

export default function CoverLetterPage() {
  const coverLetter = useAnalysisStore((state) => state.coverLetter);
  const setCoverLetter = useAnalysisStore((state) => state.setCoverLetter);

  const mutation = useMutation({
    mutationFn: generateCoverLetter,
    onSuccess: (data) => {
      setCoverLetter(data);
      toast.success("Cover letter generated.");
    },
    onError: () => {
      toast.error("Unable to generate cover letter.");
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Cover letter generator"
        description="Create tailored cover letters aligned to your resume and job."
      />

      <AnalysisForm
        onSubmit={(payload) => mutation.mutate(payload)}
        submitLabel={
          mutation.isPending ? "Generating..." : "Generate cover letter"
        }
      />

      {coverLetter ? (
        <AnalysisBlock title="Cover letter" content={coverLetter.content} />
      ) : (
        <EmptyState
          title="Generate a cover letter"
          description="Run the generator to see a full draft here."
        />
      )}
    </div>
  );
}

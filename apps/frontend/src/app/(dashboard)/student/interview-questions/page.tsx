"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AnalysisBlock } from "@/components/common/analysis-block";
import { AnalysisForm } from "@/components/common/analysis-form";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { generateInterviewQuestions } from "@/lib/api/analysis";
import { useAnalysisStore } from "@/stores/analysis-store";

export default function InterviewQuestionsPage() {
  const questions = useAnalysisStore((state) => state.questions);
  const setQuestions = useAnalysisStore((state) => state.setQuestions);

  const mutation = useMutation({
    mutationFn: generateInterviewQuestions,
    onSuccess: (data) => {
      setQuestions(data);
      toast.success("Interview questions generated.");
    },
    onError: () => {
      toast.error("Unable to generate questions.");
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Interview questions"
        description="Generate tailored interview questions based on your resume and JD."
      />

      <AnalysisForm
        onSubmit={(payload) => mutation.mutate(payload)}
        submitLabel={
          mutation.isPending ? "Generating..." : "Generate questions"
        }
      />

      {questions ? (
        <AnalysisBlock
          title="Interview questions"
          content={questions.content}
        />
      ) : (
        <EmptyState
          title="Generate interview questions"
          description="Run the generator to see curated questions here."
        />
      )}
    </div>
  );
}

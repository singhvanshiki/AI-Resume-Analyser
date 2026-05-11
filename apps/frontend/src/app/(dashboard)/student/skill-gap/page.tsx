"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AnalysisForm } from "@/components/common/analysis-form";
import { EmptyState } from "@/components/common/empty-state";
import { SkillTags } from "@/components/common/skill-tags";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { runMatchAnalysis } from "@/lib/api/analysis";
import { useAnalysisStore } from "@/stores/analysis-store";

export default function SkillGapPage() {
  const match = useAnalysisStore((state) => state.match);
  const setMatch = useAnalysisStore((state) => state.setMatch);

  const mutation = useMutation({
    mutationFn: runMatchAnalysis,
    onSuccess: (data) => {
      setMatch(data);
      toast.success("Skill gap analysis ready.");
    },
    onError: () => {
      toast.error("Skill gap analysis failed.");
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Skill gap analysis"
        description="Identify missing skills and focus areas for the role."
      />

      <AnalysisForm
        onSubmit={(payload) => mutation.mutate(payload)}
        submitLabel={mutation.isPending ? "Analyzing..." : "Analyze skill gaps"}
      />

      {match ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Missing skills</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillTags skills={match.missing_skills} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Growth areas</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillTags skills={match.gaps} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <EmptyState
          title="Run skill gap analysis"
          description="Compare a resume and job description to view missing skills."
        />
      )}
    </div>
  );
}

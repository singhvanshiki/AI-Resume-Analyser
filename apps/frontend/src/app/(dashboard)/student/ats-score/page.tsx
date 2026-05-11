"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ScoreBreakdown } from "@/components/charts/score-breakdown";
import { ScoreRadial } from "@/components/charts/score-radial";
import { AnalysisForm } from "@/components/common/analysis-form";
import { ATSScoreCard } from "@/components/common/ats-score-card";
import { EmptyState } from "@/components/common/empty-state";
import { SkillTags } from "@/components/common/skill-tags";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { runAtsAnalysis } from "@/lib/api/analysis";
import { useAnalysisStore } from "@/stores/analysis-store";

export default function AtsScorePage() {
  const ats = useAnalysisStore((state) => state.ats);
  const setAts = useAnalysisStore((state) => state.setAts);
  const addAtsHistory = useAnalysisStore((state) => state.addAtsHistory);

  const mutation = useMutation({
    mutationFn: runAtsAnalysis,
    onSuccess: (data) => {
      setAts(data);
      addAtsHistory(data.ats_score);
      toast.success("ATS analysis complete.");
    },
    onError: () => {
      toast.error("ATS analysis failed. Try again.");
    },
  });

  const breakdown = ats
    ? Object.entries(ats.category_scores).map(([name, value]) => ({
        name: name.replace(/_/g, " "),
        value,
      }))
    : [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="ATS score"
        description="Score your resume against a role and see ATS drivers instantly."
      />

      <AnalysisForm
        onSubmit={(payload) => mutation.mutate(payload)}
        submitLabel={mutation.isPending ? "Running..." : "Run ATS analysis"}
      />

      {ats ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <ATSScoreCard
              score={ats.ats_score}
              semanticSimilarity={ats.semantic_similarity}
            />
            <Card>
              <CardHeader>
                <CardTitle>Explanation</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {ats.explanation}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {ats.recommendations.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Score breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreBreakdown data={breakdown} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>ATS gauge</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreRadial score={ats.ats_score} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Missing skills</CardTitle>
              </CardHeader>
              <CardContent>
                <SkillTags skills={ats.missing_skills} />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <EmptyState
          title="Run your first ATS analysis"
          description="Select a resume and job description to receive scoring insights."
        />
      )}
    </div>
  );
}

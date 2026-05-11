"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AnalysisForm } from "@/components/common/analysis-form";
import { EmptyState } from "@/components/common/empty-state";
import { SkillTags } from "@/components/common/skill-tags";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractSkills, runMatchAnalysis } from "@/lib/api/analysis";
import { useAnalysisStore } from "@/stores/analysis-store";
import { useDashboardStore } from "@/stores/dashboard-store";

export default function ResumeAnalysisPage() {
  const match = useAnalysisStore((state) => state.match);
  const setMatch = useAnalysisStore((state) => state.setMatch);
  const skills = useAnalysisStore((state) => state.skills);
  const setSkills = useAnalysisStore((state) => state.setSkills);
  const selectedResumeId = useDashboardStore((state) => state.selectedResumeId);

  const mutation = useMutation({
    mutationFn: runMatchAnalysis,
    onSuccess: (data) => {
      setMatch(data);
      toast.success("Resume match analysis complete.");
    },
    onError: () => {
      toast.error("Match analysis failed. Try again.");
    },
  });

  const skillMutation = useMutation({
    mutationFn: extractSkills,
    onSuccess: (data) => {
      setSkills(data);
      toast.success("Skills extracted.");
    },
    onError: () => {
      toast.error("Unable to extract skills.");
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resume analysis"
        description="Compare your resume against a job description and uncover gaps."
      />

      <AnalysisForm
        onSubmit={(payload) => mutation.mutate(payload)}
        submitLabel={mutation.isPending ? "Analyzing..." : "Run match analysis"}
      />

      {match ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Overall fit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-semibold text-foreground">
                {match.semantic_similarity.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">
                {match.overall_fit ?? "Alignment insights generated from AI."}
              </p>
            </CardContent>
          </Card>
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
              <CardTitle>Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillTags skills={match.strengths} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Resume skills</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!selectedResumeId) {
                    toast.error("Select a resume to extract skills.");
                    return;
                  }
                  skillMutation.mutate({ resume_id: selectedResumeId });
                }}
                disabled={skillMutation.isPending}
              >
                {skillMutation.isPending ? "Extracting..." : "Extract skills"}
              </Button>
            </CardHeader>
            <CardContent>
              {skills?.skills?.length ? (
                <SkillTags skills={skills.skills} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Extract skills to see a structured list from the resume.
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gaps</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillTags skills={match.gaps} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <EmptyState
          title="No analysis yet"
          description="Run a resume vs job description comparison to populate this view."
        />
      )}
    </div>
  );
}

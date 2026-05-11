"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingBlock } from "@/components/common/loading-block";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResume } from "@/lib/api/resumes";

export default function CandidateDetailsPage() {
  const params = useParams();
  const resumeId = params?.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ["resume", resumeId],
    queryFn: () => getResume(resumeId),
    enabled: Boolean(resumeId),
  });

  if (isLoading) {
    return <LoadingBlock message="Loading candidate details" />;
  }

  if (!data) {
    return (
      <EmptyState
        title="Resume not found"
        description="We could not load this candidate."
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Candidate details"
        description={data.original_filename}
      />

      <Card>
        <CardHeader>
          <CardTitle>Resume text</CardTitle>
        </CardHeader>
        <CardContent className="whitespace-pre-wrap text-sm text-muted-foreground">
          {data.text}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parsed sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(data.sections ?? {}).map(([key, value]) => (
            <div key={key} className="rounded-lg border border-border/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {key}
              </p>
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                {String(value)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

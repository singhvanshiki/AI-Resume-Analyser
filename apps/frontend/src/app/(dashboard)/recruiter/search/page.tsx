"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { listResumes } from "@/lib/api/resumes";
import { useDashboardStore } from "@/stores/dashboard-store";

export default function CandidateSearchPage() {
  const { data: resumes } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => listResumes(),
  });

  const searchQuery = useDashboardStore((state) => state.searchQuery);
  const setSearchQuery = useDashboardStore((state) => state.setSearchQuery);

  const filtered = resumes?.items.filter((resume) =>
    resume.original_filename.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Search candidates"
        description="Filter candidate resumes and open detailed views."
      />

      <Input
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search by file name"
      />

      <div className="grid gap-3">
        {filtered?.length ? (
          filtered.map((resume) => (
            <Card key={resume.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {resume.original_filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {resume.content_type}
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/recruiter/candidates/${resume.id}`}>
                    View details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            title="No candidates found"
            description="Try a different search term or upload new resumes."
          />
        )}
      </div>
    </div>
  );
}

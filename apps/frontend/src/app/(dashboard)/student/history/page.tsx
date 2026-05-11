"use client";

import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/common/empty-state";
import { ResumeCard } from "@/components/common/resume-card";
import { PageHeader } from "@/components/layout/page-header";
import { listResumes } from "@/lib/api/resumes";

export default function ResumeHistoryPage() {
  const { data: resumes } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => listResumes(),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resume history"
        description="Review every resume you have uploaded and analyzed."
      />

      <div className="space-y-3">
        {resumes?.items.length ? (
          resumes.items.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))
        ) : (
          <EmptyState
            title="No resumes yet"
            description="Upload a resume to start tracking your history."
          />
        )}
      </div>
    </div>
  );
}

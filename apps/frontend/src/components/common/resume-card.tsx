import { FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { ResumeResponse } from "@/lib/types";

interface ResumeCardProps {
  resume: ResumeResponse;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  return (
    <Card className="transition hover:border-primary/40">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {resume.original_filename}
            </p>
            <p className="text-xs text-muted-foreground">
              Uploaded {formatDate(resume.created_at)}
            </p>
          </div>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {resume.content_type}
        </p>
      </CardContent>
    </Card>
  );
}

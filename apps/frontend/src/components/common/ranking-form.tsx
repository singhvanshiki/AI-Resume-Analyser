"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listJobDescriptions } from "@/lib/api/jobs";
import { listResumes } from "@/lib/api/resumes";

interface RankingFormProps {
  onSubmit: (jobId: string, resumeIds: string[]) => void;
}

export function RankingForm({ onSubmit }: RankingFormProps) {
  const { data: resumes } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => listResumes(),
  });

  const { data: jobs } = useQuery({
    queryKey: ["job-descriptions"],
    queryFn: () => listJobDescriptions(),
  });

  const [jobId, setJobId] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const resumeIds = useMemo(
    () =>
      Object.entries(selected)
        .filter(([, value]) => value)
        .map(([id]) => id),
    [selected],
  );

  return (
    <div className="grid gap-6 rounded-xl border border-border/70 bg-card p-6">
      <div className="grid gap-2">
        <Label>Job description</Label>
        <Select value={jobId} onValueChange={setJobId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a job description" />
          </SelectTrigger>
          <SelectContent>
            {jobs?.items?.map((job) => (
              <SelectItem key={job.id} value={job.id}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        <Label>Candidate resumes</Label>
        <div className="grid gap-2">
          {resumes?.items?.map((resume) => (
            <div
              key={resume.id}
              className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2 text-sm"
            >
              <Checkbox
                aria-label={`Select ${resume.original_filename}`}
                checked={selected[resume.id] ?? false}
                onCheckedChange={(value) =>
                  setSelected((state) => ({
                    ...state,
                    [resume.id]: Boolean(value),
                  }))
                }
              />
              <span className="font-medium text-foreground">
                {resume.original_filename}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => onSubmit(jobId, resumeIds)}
          disabled={!jobId || resumeIds.length === 0}
        >
          Compare candidates
        </Button>
      </div>
    </div>
  );
}

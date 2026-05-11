"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { listJobDescriptions } from "@/lib/api/jobs";
import { listResumes } from "@/lib/api/resumes";
import { useDashboardStore } from "@/stores/dashboard-store";

const schema = z
  .object({
    resumeId: z.string().min(1, "Select a resume"),
    jobDescriptionId: z.string().optional(),
    jobDescriptionText: z.string().optional(),
  })
  .refine((data) => data.jobDescriptionId || data.jobDescriptionText, {
    message: "Provide a job description or select one from the list.",
    path: ["jobDescriptionText"],
  });

type AnalysisFormValues = z.infer<typeof schema>;

interface AnalysisFormProps {
  onSubmit: (payload: {
    resume_id: string;
    job_description_id?: string | null;
    job_description_text?: string | null;
  }) => void;
  submitLabel: string;
}

export function AnalysisForm({ onSubmit, submitLabel }: AnalysisFormProps) {
  const setSelectedResumeId = useDashboardStore(
    (state) => state.setSelectedResumeId,
  );
  const setSelectedJobId = useDashboardStore((state) => state.setSelectedJobId);

  const { data: resumes } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => listResumes(),
  });

  const { data: jobs } = useQuery({
    queryKey: ["job-descriptions"],
    queryFn: () => listJobDescriptions(),
  });

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    watch,
  } = useForm<AnalysisFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      resumeId: "",
      jobDescriptionId: "",
      jobDescriptionText: "",
    },
  });

  const jobText = watch("jobDescriptionText");

  return (
    <form
      onSubmit={handleSubmit((values) => {
        setSelectedResumeId(values.resumeId);
        setSelectedJobId(values.jobDescriptionId || null);
        onSubmit({
          resume_id: values.resumeId,
          job_description_id: values.jobDescriptionId || null,
          job_description_text: values.jobDescriptionText || null,
        });
      })}
      className="grid gap-6 rounded-xl border border-border/70 bg-card p-6"
    >
      <div className="grid gap-2">
        <Label htmlFor="resume">Resume</Label>
        <Controller
          name="resumeId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger id="resume">
                <SelectValue placeholder="Select a resume" />
              </SelectTrigger>
              <SelectContent>
                {resumes?.items?.map((resume) => (
                  <SelectItem key={resume.id} value={resume.id}>
                    {resume.original_filename}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.resumeId && (
          <p className="text-xs text-destructive">{errors.resumeId.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="job">Job description</Label>
        <Controller
          name="jobDescriptionId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger id="job">
                <SelectValue placeholder="Select a saved job description" />
              </SelectTrigger>
              <SelectContent>
                {jobs?.items?.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="job-text">Or paste a job description</Label>
        <Textarea
          id="job-text"
          placeholder="Paste the job description to use for this analysis"
          {...register("jobDescriptionText")}
        />
        {errors.jobDescriptionText && !jobText && (
          <p className="text-xs text-destructive">
            {errors.jobDescriptionText.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createJobDescription, listJobDescriptions } from "@/lib/api/jobs";
import { formatDate } from "@/lib/format";

const schema = z.object({
  title: z.string().min(2),
  company: z.string().optional(),
  location: z.string().optional(),
  description_text: z.string().min(10),
});

type JobFormValues = z.infer<typeof schema>;

export default function UploadJobPage() {
  const queryClient = useQueryClient();
  const { data: jobs } = useQuery({
    queryKey: ["job-descriptions"],
    queryFn: () => listJobDescriptions(),
  });

  const form = useForm<JobFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      description_text: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createJobDescription,
    onSuccess: () => {
      toast.success("Job description saved.");
      queryClient.invalidateQueries({ queryKey: ["job-descriptions"] });
      form.reset();
    },
    onError: () => {
      toast.error("Unable to save the job description.");
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Upload job description"
        description="Store job descriptions to compare against your resume."
      />

      <Card>
        <CardHeader>
          <CardTitle>New job description</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <div className="space-y-2">
              <Label htmlFor="title">Role title</Label>
              <Input id="title" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...form.register("company")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...form.register("location")} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Job description</Label>
              <Textarea
                id="description"
                {...form.register("description_text")}
              />
              {form.formState.errors.description_text && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.description_text.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save job description"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved job descriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {jobs?.items?.map((job) => (
            <div
              key={job.id}
              className="rounded-lg border border-border/60 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {job.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {job.company ?? ""}{" "}
                    {job.location ? `- ${job.location}` : ""}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(job.created_at)}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {job.description_text}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

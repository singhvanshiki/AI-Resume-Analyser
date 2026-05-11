"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileDropzone } from "@/components/common/file-dropzone";
import { ResumeCard } from "@/components/common/resume-card";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { listResumes, uploadResume } from "@/lib/api/resumes";
import { useUploadStore } from "@/stores/upload-store";

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

export default function UploadResumesPage() {
  const queryClient = useQueryClient();
  const { data: resumes } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => listResumes(),
  });

  const uploads = useUploadStore((state) => state.uploads);
  const addUpload = useUploadStore((state) => state.addUpload);
  const updateUpload = useUploadStore((state) => state.updateUpload);

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      const id = createId();
      addUpload({ id, fileName: file.name, progress: 0, status: "uploading" });
      try {
        await uploadResume(file, (progress) => updateUpload(id, { progress }));
        updateUpload(id, { progress: 100, status: "success" });
        toast.success(`${file.name} uploaded.`);
        queryClient.invalidateQueries({ queryKey: ["resumes"] });
      } catch (_error) {
        updateUpload(id, { status: "error", error: "Upload failed" });
        toast.error(`${file.name} failed to upload.`);
      }
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Upload candidate resumes"
        description="Drop multiple resumes to build a candidate pool."
      />

      <FileDropzone
        onFiles={handleFiles}
        multiple
        helperText="PDF, DOCX, or TXT. Upload multiple files at once."
      />

      {uploads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploads.map((upload) => (
              <div key={upload.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {upload.fileName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {upload.status}
                  </span>
                </div>
                <Progress value={upload.progress} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Candidate library
        </h3>
        {resumes?.items?.map((resume) => (
          <ResumeCard key={resume.id} resume={resume} />
        ))}
      </div>
    </div>
  );
}

"use client";

import { FileText, UploadCloud } from "lucide-react";
import { useMemo } from "react";
import { useDropzone } from "react-dropzone";

import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  helperText?: string;
  className?: string;
}

const acceptedTypes = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/msword": [".doc"],
  "text/plain": [".txt"],
};

export function FileDropzone({
  onFiles,
  multiple = false,
  helperText,
  className,
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: acceptedTypes,
      multiple,
      onDrop: (accepted) => onFiles(accepted),
    });

  const rejectionMessage = useMemo(() => {
    if (!fileRejections.length) return null;
    return (
      fileRejections[0]?.errors?.[0]?.message ??
      "One or more files could not be accepted."
    );
  }, [fileRejections]);

  return (
    <div
      {...getRootProps({
        className: cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/40 px-6 py-10 text-center transition hover:border-primary/60",
          isDragActive && "border-primary bg-primary/5",
          className,
        ),
      })}
    >
      <input {...getInputProps()} />
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background">
        {isDragActive ? (
          <UploadCloud className="h-6 w-6 text-primary" />
        ) : (
          <FileText className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">
          {isDragActive
            ? "Drop the files to upload"
            : "Drag and drop resumes here"}
        </p>
        <p className="text-xs text-muted-foreground">
          {helperText ?? "PDF, DOCX, or TXT. Max 20 MB."}
        </p>
      </div>
      {rejectionMessage && (
        <p className="text-xs text-destructive">{rejectionMessage}</p>
      )}
    </div>
  );
}

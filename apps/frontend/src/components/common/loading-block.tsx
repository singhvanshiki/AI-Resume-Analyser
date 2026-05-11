import { Skeleton } from "@/components/ui/skeleton";

interface LoadingBlockProps {
  message?: string;
}

export function LoadingBlock({ message = "Loading" }: LoadingBlockProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border/70 p-10 text-center">
      <Skeleton className="h-8 w-48" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

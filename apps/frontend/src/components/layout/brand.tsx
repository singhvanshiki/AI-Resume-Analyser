import Link from "next/link";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  compact?: boolean;
  className?: string;
}

export function BrandLogo({
  href = "/",
  compact = false,
  className,
}: BrandLogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-3", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-sm font-bold text-white shadow-soft">
        AI
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="font-display text-lg font-semibold text-foreground">
            AIRA
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Resume IQ
          </p>
        </div>
      )}
    </Link>
  );
}

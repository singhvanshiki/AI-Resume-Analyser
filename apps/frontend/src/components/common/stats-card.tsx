import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  trend?: string;
  className?: string;
}

export function StatsCard({ label, value, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("shadow-soft", className)}>
      <CardContent className="space-y-2 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          {trend && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <ArrowUpRight className="h-3 w-3" />
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

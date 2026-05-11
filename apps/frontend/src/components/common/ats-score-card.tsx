import { Gauge } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatScore } from "@/lib/format";

interface ATSScoreCardProps {
  score: number;
  semanticSimilarity?: number;
}

export function ATSScoreCard({ score, semanticSimilarity }: ATSScoreCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Gauge className="h-4 w-4" />
            ATS Score
          </div>
          <Badge
            variant={
              score >= 75 ? "success" : score >= 55 ? "warning" : "secondary"
            }
          >
            {score >= 75 ? "Strong" : score >= 55 ? "Needs work" : "Improve"}
          </Badge>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-semibold text-foreground">
            {formatScore(score)}
          </p>
          {semanticSimilarity !== undefined && (
            <p className="text-xs text-muted-foreground">
              Semantic match {formatScore(semanticSimilarity)}
            </p>
          )}
        </div>
        <Progress value={score} />
      </CardContent>
    </Card>
  );
}

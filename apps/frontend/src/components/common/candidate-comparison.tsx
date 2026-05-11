import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RankingItem } from "@/lib/types";

interface CandidateComparisonProps {
  rankings: RankingItem[];
}

export function CandidateComparison({ rankings }: CandidateComparisonProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rankings.map((candidate) => (
        <Card key={candidate.resume_id}>
          <CardHeader>
            <CardTitle>Candidate #{candidate.rank}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground">Resume ID</p>
            <p className="text-sm font-semibold text-foreground">
              {candidate.resume_id}
            </p>
            <p className="text-xs text-muted-foreground">Score</p>
            <p className="text-2xl font-semibold text-foreground">
              {candidate.score}
            </p>
            <p className="text-xs text-muted-foreground">Highlights</p>
            <p className="text-sm text-muted-foreground">
              {candidate.explanation}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalysisBlockProps {
  title: string;
  content: string;
}

export function AnalysisBlock({ title, content }: AnalysisBlockProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap text-sm text-muted-foreground">
          {content}
        </div>
      </CardContent>
    </Card>
  );
}

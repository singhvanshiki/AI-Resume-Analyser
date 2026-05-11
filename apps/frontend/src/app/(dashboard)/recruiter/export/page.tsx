"use client";

import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { RankingTable } from "@/components/common/ranking-table";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { useAnalysisStore } from "@/stores/analysis-store";

export default function ExportResultsPage() {
  const ranking = useAnalysisStore((state) => state.ranking);

  const handleExport = () => {
    if (!ranking?.rankings?.length) {
      toast.error("No ranking data to export.");
      return;
    }

    const header = "rank,resume_id,score,explanation";
    const rows = ranking.rankings.map(
      (item) =>
        `${item.rank},${item.resume_id},${item.score},"${item.explanation}"`,
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "candidate-ranking.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Export ready.");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Export results"
        description="Download candidate rankings as CSV."
        action={<Button onClick={handleExport}>Export CSV</Button>}
      />

      {ranking?.rankings?.length ? (
        <RankingTable data={ranking.rankings} />
      ) : (
        <EmptyState
          title="No data to export"
          description="Run a candidate ranking to enable exports."
        />
      )}
    </div>
  );
}

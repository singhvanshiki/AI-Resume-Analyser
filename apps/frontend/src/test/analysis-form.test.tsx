import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { AnalysisForm } from "@/components/common/analysis-form";

const queryClient = new QueryClient();

describe("AnalysisForm", () => {
  it("renders submit button", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AnalysisForm onSubmit={() => {}} submitLabel="Run analysis" />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Run analysis")).toBeInTheDocument();
  });
});

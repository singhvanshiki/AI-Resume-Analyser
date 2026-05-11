import { render, screen } from "@testing-library/react";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders a button label", () => {
    render(<Button>Run analysis</Button>);
    expect(
      screen.getByRole("button", { name: "Run analysis" }),
    ).toBeInTheDocument();
  });
});

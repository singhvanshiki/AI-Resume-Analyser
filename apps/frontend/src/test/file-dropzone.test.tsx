import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { FileDropzone } from "@/components/common/file-dropzone";

describe("FileDropzone", () => {
  it("renders helper text", () => {
    render(<FileDropzone onFiles={vi.fn()} />);
    expect(screen.getByText("Drag and drop resumes here")).toBeInTheDocument();
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeView } from "./HomeView";

describe("HomeView", () => {
  it("renders home page text", () => {
    render(<HomeView />);
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
});
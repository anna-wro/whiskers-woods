import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Map2D from "./Map2D";

describe("Map2D Component", () => {
  it("should render without crashing", () => {
    const { container } = render(<Map2D />);
    expect(container.querySelector(".container")).toBeInTheDocument();
  });

  it("should display the initial tip", () => {
    const { getByText } = render(<Map2D />);
    expect(
      getByText(/I'm a little bit shy, try pressing the arrows!/)
    ).toBeInTheDocument();
  });

  it("should update the tip after key press", () => {
    const { getByText } = render(<Map2D />);
    fireEvent.keyDown(document, { key: "ArrowUp" });
    expect(getByText(/Awww, you found me! Wanna walk/)).toBeInTheDocument();
  });
});

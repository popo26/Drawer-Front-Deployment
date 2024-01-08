import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import LandingPage from "../LandingPage";
import { BrowserRouter } from "react-router-dom";

test("LandingPage contains logo image", () => {
  render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>
  );
  const imageLogo = screen.queryByTestId("imageLogo");
  expect(imageLogo).toBeDefined();
});

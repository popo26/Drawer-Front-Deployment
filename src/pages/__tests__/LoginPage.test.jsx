import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginPage from "../LoginPage";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "../../context/UserContext";

test("Login Page contains login button", () => {
  render(
    <UserContextProvider>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </UserContextProvider>
  );

  const loginElement = screen.getByText(/Login/i);
  expect(loginElement).toBeInTheDocument();
});

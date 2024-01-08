import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfilePage from "../ProfilePage";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "../../context/UserContext";

test("Login Page contains login button", () => {
  render(
    <UserContextProvider>
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    </UserContextProvider>
  );

  const usernameElement = screen.getByText(/Username/i);
  const emailElement = screen.getByText(/Email/i);
  const passwordElement = screen.getByText(/Password/i);

  expect(usernameElement).toBeInTheDocument();
  expect(emailElement).toBeInTheDocument();
  expect(passwordElement).toBeInTheDocument();
});

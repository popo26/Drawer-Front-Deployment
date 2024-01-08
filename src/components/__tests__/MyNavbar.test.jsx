import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MyNavbar from "../MyNavbar";
import { BrowserRouter, Router } from "react-router-dom";
import { UserContextProvider } from "../../context/UserContext";
import { useUserContext } from "../../context/UserContext";

describe("MyNavbar", () => {
  it('A word "Hi" shoud not be in MyNavbar becuase user is not logged in', () => {
    render(
      <UserContextProvider>
        <BrowserRouter>
          <MyNavbar />
        </BrowserRouter>
      </UserContextProvider>
    );
    expect(screen.queryByText("Hi")).not.toBeInTheDocument();
  });
});

import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "../HomePage";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "../../context/UserContext";
import { DataProvider } from "../../context/DataContext";

test("Home Page contains Create New Drawer button", () => {
  render(
    <UserContextProvider>
      <BrowserRouter>
        <DataProvider>
          <HomePage />
        </DataProvider>
      </BrowserRouter>
    </UserContextProvider>
  );

  const createNewDrawerBtn = screen.getByTestId("createNewDrawer");
  expect(createNewDrawerBtn).toBeInTheDocument();
});

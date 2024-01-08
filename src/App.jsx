import { useState } from "react";
import { Link } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import MyNavbar from "./components/MyNavbar";
import ScribbleBtn from "./components/ScribbleBtn";
import "./css/App.css";
import { DataProvider } from "./context/DataContext";
import { SelectedDrawerProvider } from "./context/SelectedDrawerContext";
import { SelectedScribbleProvider } from "./context/SelectedScribbleContext";
import { DrawerToBeMovedContextProvider } from "./context/DrawerToBeMovedContext";
import { DrawerNameProvider } from "./context/DrawerNameContext";
import { FileProvider } from "./context/FileContext";
import { useUserContext } from "./context/UserContext";
import { useTimeout } from "./hooks/useTimeout";

export default function App() {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const { user } = useUserContext();

  const handleClickExpand = (passedIndex) => {
    setExpandedIndex((currentExpandedIndex) => {
      if (currentExpandedIndex === passedIndex) {
        return -1;
      } else {
        return passedIndex;
      }
    });
  };

  useTimeout();

  return (
    <>
      <DataProvider>
        <SelectedDrawerProvider>
          <SelectedScribbleProvider>
            <DrawerToBeMovedContextProvider>
              <DrawerNameProvider>
                <FileProvider>
                  <MyNavbar />

                  <AppRoutes
                    expandedIndex={expandedIndex}
                    handleExpand={handleClickExpand}
                  />
                  <Link to="/scribble">
                    {user.isLoggedIn && <ScribbleBtn />}
                  </Link>
                </FileProvider>
              </DrawerNameProvider>
            </DrawerToBeMovedContextProvider>
          </SelectedScribbleProvider>
        </SelectedDrawerProvider>
      </DataProvider>
    </>
  );
}

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../css/App.css";
import SearchPage from "../pages/SearchPage";
import CreateDrawerPage from "../pages/CreateDrawerPage";
import ScribblePage from "../pages/ScribblePage";
import ProfilePage from "../pages/ProfilePage";
import ScribbleListPage from "../pages/ScribbleListPage";
import HomePage from "../pages/HomePage";
import DrawerListPage from "../pages/DrawerListPage";
import PerScribblePage from "../pages/PerScribblePage";
import SortDrawerPage from "../pages/SortDrawerPage";
import SortDrawerPreviewPage from "../pages/SortDrawerPreviewPage";
import TestPage from "../pages/TestPage";
import { PageNotFound } from "../pages/PageNotFound";
import SortScribblePage from "../pages/SortScribblePage";
import SortScribblePreviewPage from "../pages/SortScribblePreviewPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import LandingPage from "../pages/LandingPage";
import PrivateRoute from "../hocs/PrivateRoute";
import UnPrivateRoute from "../hocs/UnPrivateRoute";

export default function AppRoutes({
  expandedIndex,
  handleExpand,
  files,
  setFiles,
}) {
  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={
            <UnPrivateRoute>
              <LoginPage />
            </UnPrivateRoute>
          }
        ></Route>

        <Route
          path="/register"
          element={
            <UnPrivateRoute>
              <RegisterPage />
            </UnPrivateRoute>
          }
        ></Route>
        <Route index element={<LandingPage />}></Route>

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage
                expandedIndex={expandedIndex}
                handleExpand={handleExpand}
              />
            </PrivateRoute>
          }
        ></Route>

        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SearchPage />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/scribble"
          element={
            <PrivateRoute>
              <ScribblePage />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/stray"
          element={
            <PrivateRoute>
              <ScribbleListPage />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/scribble/:id"
          element={
            <PrivateRoute>
              <PerScribblePage files={files} setFiles={setFiles} />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/sort"
          element={
            <PrivateRoute>
              <SortScribblePage />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/sort-preview"
          element={
            <PrivateRoute>
              <SortScribblePreviewPage />
            </PrivateRoute>
          }
        ></Route>

        <Route
          path="/sort-drawer"
          element={
            <PrivateRoute>
              <SortDrawerPage />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/sort-drawer-preview"
          element={
            <PrivateRoute>
              <SortDrawerPreviewPage />
            </PrivateRoute>
          }
        ></Route>

        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateDrawerPage />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/drawer-list/:id"
          element={
            <PrivateRoute>
              {/* <DrawerListPage expandedIndex={expandedIndex} /> */}
              <DrawerListPage />
            </PrivateRoute>
          }
        ></Route>
        <Route path="/test" element={<TestPage />}></Route>
        <Route
          path="*"
          element={
            <PrivateRoute>
              <PageNotFound />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

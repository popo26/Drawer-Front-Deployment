import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

export default function UnPrivateRoute({
  redirectPath = "/home",
  children,
  ...rest
}) {
  const { user } = useUserContext();

  ///+++++++++++++If user has already logged in, user gets redirected to home page when trying to access /register or /login route++++++++++++++
  if (user) {
    if (user.isLoggedIn) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children ? children : <Outlet />;
}

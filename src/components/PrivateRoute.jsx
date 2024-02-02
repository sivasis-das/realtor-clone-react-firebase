import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../customHooks/useAuthStatus";

function PrivateRoute({ children }) {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return <h1>Loading...</h1>;
  }

  return loggedIn ? children : <Navigate to="/sign-in" />;
}

export default PrivateRoute;

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../customHooks/useAuthStatus";
import Spinner from "./Spinner";

function PrivateRoute({ children }) {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return <Spinner />;
  }

  return loggedIn ? children : <Navigate to="/sign-in" />;
}

export default PrivateRoute;

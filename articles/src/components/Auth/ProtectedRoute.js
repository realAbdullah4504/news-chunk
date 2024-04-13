import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  const token = localStorage.getItem("token");
  const tokenG = localStorage.getItem("tokenG");

  if (!isAuthenticated && !token && !tokenG) {
    return <Navigate to={"/login"} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;

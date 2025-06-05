import { jwtDecode } from "jwt-decode";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // seconds

    if (decoded.exp < currentTime) {
      localStorage.removeItem("accessToken");
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (profile?.role === "ADMIN" || profile?.role === "SUPER_ADMIN") {
      return children;
    } else {
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
  } catch (error) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
};

export default PrivateRoute;

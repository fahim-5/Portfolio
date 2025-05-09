import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import portfolioService from "../services/portfolioService";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Check authentication status
    const authStatus = portfolioService.isAuthenticated();
    setIsAuthenticated(authStatus);
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;

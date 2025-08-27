import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // TODO: Implement authentication check
  // - Check if user has valid authentication token
  // - Redirect to login if not authenticated
  // - Allow access if authenticated
  
  // Placeholder: always allow access for now
  const isAuthenticated = true; // This should check actual auth state
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;

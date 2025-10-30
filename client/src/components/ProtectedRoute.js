import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, admin } = useAuth();
  
  console.log('ProtectedRoute: isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute: admin:', admin);
  
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
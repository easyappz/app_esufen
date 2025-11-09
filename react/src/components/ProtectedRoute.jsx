import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div data-easytag="id1-src/components/ProtectedRoute.jsx">
      {children}
    </div>
  );
};

export default ProtectedRoute;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // 1. While restoring session on mount, show spinner to avoid authentication flicker
  if (loading) {
    return <Loading message="Verifying authentication session..." />;
  }

  // 2. Unauthenticated user -> redirect to /login
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // 3. Customer trying to access Admin route -> redirect to /unauthorized (Requirement 25 & 66)
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Authenticated & Authorized -> render protected content
  return children;
};

export default ProtectedRoute;

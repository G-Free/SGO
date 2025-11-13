import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import AccessDeniedPage from './AccessDenied';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { hasRole } = useAuth();

  const isAuthorized = allowedRoles.some(role => hasRole(role));

  if (!isAuthorized) {
    return <AccessDeniedPage />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

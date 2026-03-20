import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useApp } from '../../context/AppContext';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useApp();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

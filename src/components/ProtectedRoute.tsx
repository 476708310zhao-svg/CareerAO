import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      showToast('请先登录后继续操作', 'error');
      openAuthModal('login');
    }
  }, [isAuthenticated, openAuthModal, showToast]);

  if (!isAuthenticated) {
    // Redirect to home page but keep the intended destination in state if needed
    // For now, just redirect to home
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

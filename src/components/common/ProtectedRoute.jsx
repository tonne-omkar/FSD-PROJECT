import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute — wraps any page that requires authentication.
 * Optionally restricts to specific roles.
 *
 * Usage in App.jsx:
 *   <Route element={<ProtectedRoute />}>                        // any logged-in user
 *   <Route element={<ProtectedRoute roles={['student']} />}>    // students only
 *   <Route element={<ProtectedRoute roles={['tpo','recruiter']} />}>  // tpo or recruiter
 */
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // Not logged in → redirect to login, preserving intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role → redirect to their own dashboard
  if (roles && !roles.includes(role)) {
    const dashboardMap = {
      student: '/student/dashboard',
      tpo: '/tpo/dashboard',
      recruiter: '/recruiter/dashboard',
    };
    return <Navigate to={dashboardMap[role] || '/login'} replace />;
  }

  // Authorized → render child routes or nested <Outlet />
  return children || <Outlet />;
}

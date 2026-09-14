import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlacementProvider } from './context/PlacementContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Toast from './components/common/Toast';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import TPODashboardPage from './pages/TPODashboardPage';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import DriveDetailsPage from './pages/DriveDetailsPage';
import ApplyDrivePage from './pages/ApplyDrivePage';
import TPODriveApplicantsPage from './pages/TPODriveApplicantsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlacementProvider>
          <Routes>
            {/* Public pages — full-screen, no navbar/footer */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/landing" element={<LandingPage />} />

            {/* Protected app pages — with Layout (navbar, footer, chatbot) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                {/* Student routes */}
                <Route path="/student/dashboard" element={<StudentDashboardPage />} />
                <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />

                {/* TPO routes */}
                <Route path="/tpo/dashboard" element={<TPODashboardPage />} />
                <Route path="/tpo/drives/:id/applicants" element={<TPODriveApplicantsPage />} />

                {/* Recruiter routes */}
                <Route path="/recruiter/dashboard" element={<RecruiterDashboardPage />} />

                {/* Placement Drives & Applications (any authenticated user) */}
                <Route path="/drives/:id" element={<DriveDetailsPage />} />
                <Route path="/drives/:id/apply" element={<ApplyDrivePage />} />

                {/* Profile */}
                <Route path="/profile" element={<ProfilePage />} />

                {/* 404 Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Routes>
          <Toast />
        </PlacementProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

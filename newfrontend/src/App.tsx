import React from 'react';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from "./components/ui/sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { AlertsProvider } from "./contexts/AlertsContext";
import OfficerLayout from "./components/layout/OfficerLayout";

// Page imports
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmergencyPage from "./pages/EmergencyPage";
import MapPage from "./pages/MapPage";
import ReportPage from "./pages/ReportPage";
import SettingsPage from "./pages/SettingsPage";
import CrimeMapPage from "./pages/CrimeMapPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import DashboardPage from "./pages/DashboardPage";
import CasesPage from "./pages/CasesPage";
import IncidentsPage from "./pages/IncidentsPage";
import ReportsPage from "./pages/ReportsPage";
import AlertsPage from "./pages/AlertsPage";
import UsersPage from "./pages/UsersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationsProvider>
          <AlertsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/emergency" element={<EmergencyPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/report" element={<ReportPage />} />

                {/* Protected routes for authenticated users */}
                <Route element={<ProtectedRoute allowedRoles={['user', 'officer', 'admin']} />}>
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/crime-map" element={<CrimeMapPage />} />
                </Route>

                {/* Officer routes with location tracking */}
                <Route element={<ProtectedRoute allowedRoles={['officer']} />}>
                  <Route element={<OfficerLayout />}>
                    <Route path="/officer/dashboard" element={<DashboardPage />} />
                    <Route path="/officer/cases" element={<CasesPage />} />
                    <Route path="/officer/incidents" element={<IncidentsPage />} />
                    <Route path="/officer/reports" element={<ReportsPage />} />
                    <Route path="/officer/alerts" element={<AlertsPage />} />
                  </Route>
                </Route>

                {/* Admin routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  <Route path="/admin/cases" element={<CasesPage />} />
                  <Route path="/admin/incidents" element={<IncidentsPage />} />
                  <Route path="/admin/reports" element={<ReportsPage />} />
                  <Route path="/admin/users" element={<UsersPage />} />
                  <Route path="/admin/analytics" element={<AnalyticsPage />} />
                  <Route path="/admin/alerts" element={<AlertsPage />} />
                </Route>

                {/* Redirect old paths to new role-specific paths */}
                <Route path="/cases" element={<Navigate to="/admin/cases" replace />} />
                <Route path="/incidents" element={<Navigate to="/admin/incidents" replace />} />
                <Route path="/users" element={<Navigate to="/admin/users" replace />} />
                <Route path="/analytics" element={<Navigate to="/admin/analytics" replace />} />
                <Route path="/reports" element={<Navigate to="/admin/reports" replace />} />
                <Route path="/alerts" element={<Navigate to="/admin/alerts" replace />} />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AlertsProvider>
        </NotificationsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

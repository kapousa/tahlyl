// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from './lib/queryClient';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./axiosConfig"; // Assuming this sets up axios defaults
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import MedicalReports from "./pages/MedicalReports";
import MedicalReportDetail from "./pages/MedicalReportDetail";
import Analysis from "./pages/Analysis";
import AnalysisService from "./pages/AnalysisService";
import Profile from "./pages/Profile";
import HealthRecords from "./pages/HealthRecords";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./components/user/register";
import AuthGuard from "./components/auth/AuthGuard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// AutoLogout remains the same
const AutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout; // Specify type for clarity

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("token_type");
      navigate("/login");
    };

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logout, 30 * 60 * 1000); // 30 min inactivity
    };

    resetTimeout(); // Set initial timeout

    const events = ["click", "mousemove", "keydown", "scroll"];

    events.forEach(event =>
      window.addEventListener(event, resetTimeout)
    );

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event =>
        window.removeEventListener(event, resetTimeout)
      );
    };
  }, [navigate]);

  return null;
};

// New component for initial root path redirection
const RootRedirect = () => {
  const token = localStorage.getItem("token");
  // You might want to add a loading state here if token validation takes time
  // For now, assuming token check is synchronous
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AutoLogout /> {/* AutoLogout is always active */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root path handler: Redirects to /dashboard if logged in, else to /login */}
          <Route path="/" element={<RootRedirect />} />

          {/* Protected Routes - wrapped by AuthGuard and DashboardLayout */}
          {/* Note: The DashboardLayout implicitly handles the <Outlet /> for nested routes */}
          <Route
            element={ // Use 'element' for the layout component
              <AuthGuard>
                <DashboardLayout />
              </AuthGuard>
            }
          >
            {/* These paths are relative to the parent route's path (which is currently implicit empty string) */}
            {/* Since DashboardLayout is at the root of protected routes, the paths start from '/' */}
            <Route path="/dashboard" element={<Dashboard />} /> {/* Specific path for Dashboard */}
            <Route path="/medicalreports" element={<MedicalReports />} />
            <Route path="/medicalreports/:testId" element={<MedicalReportDetail />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/analysis/:serviceId" element={<AnalysisService />} />
            <Route path="/records" element={<HealthRecords />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch-All Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
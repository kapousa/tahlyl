import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./axiosConfig";
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
import AuthGuard from "./components/auth/AuthGuard"; // 👈 Import the AuthGuard

const queryClient = new QueryClient();

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("token_type");
      navigate("/login");
    };

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logout, 30 * 60 * 1000); // 30 min inactivity
    };

    let timeoutId = setTimeout(logout, 30 * 60 * 1000);

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AutoLogout />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <DashboardLayout />
              </AuthGuard>
            }
          >
            <Route index element={<Dashboard />} />
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

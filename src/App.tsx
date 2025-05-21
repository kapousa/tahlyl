
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import BloodTests from "./pages/BloodTests";
import BloodTestDetail from "./pages/BloodTestDetail";
import Analysis from "./pages/Analysis";
import AnalysisService from "./pages/AnalysisService";
import Profile from "./pages/Profile";
import HealthRecords from "./pages/HealthRecords";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./components/user/register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/bloodtests" element={<BloodTests />} />
            <Route path="/bloodtests/:testId" element={<BloodTestDetail />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/analysis/:serviceId" element={<AnalysisService />} />
            <Route path="/records" element={<HealthRecords />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import LiveTracking from "./pages/LiveTracking";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import IncidentManagement from "./pages/IncidentManagement";
import SearchReports from "./pages/SearchReports";
import Analytics from "./pages/Analytics";
import FakeReporterDetection from "./pages/FakeReporterDetection";
import HistoricalData from "./pages/HistoricalData";
import AlertsAndSOS from "./pages/AlertsAndSOS";
import UserManagement from "./pages/UserManagement";
import TodayReports from "./pages/dashboard/TodayReports";
import WeeklyReports from "./pages/dashboard/WeeklyReports";
import TotalReports from "./pages/dashboard/TotalReports";
import VerificationRate from "./pages/dashboard/VerificationRate";
import SOSAlertsDetail from "./pages/dashboard/SOSAlertsDetail";
import CrimeHotspots from "./pages/dashboard/CrimeHotspots";
import ResponseTime from "./pages/dashboard/ResponseTime";
import FakeReports from "./pages/dashboard/FakeReports";
import Login from "./pages/Login";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);
  
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="live-tracking" element={<LiveTracking />} />
              <Route path="incidents" element={<IncidentManagement />} />
              <Route path="search" element={<SearchReports />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="fake-detection" element={<FakeReporterDetection />} />
              <Route path="historical-data" element={<HistoricalData />} />
              <Route path="alerts" element={<AlertsAndSOS />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
              
              {/* Dashboard stat card detail routes */}
              <Route path="dashboard/today-reports" element={<TodayReports />} />
              <Route path="dashboard/weekly-reports" element={<WeeklyReports />} />
              <Route path="dashboard/total-reports" element={<TotalReports />} />
              <Route path="dashboard/verification-rate" element={<VerificationRate />} />
              <Route path="dashboard/sos-alerts" element={<SOSAlertsDetail />} />
              <Route path="dashboard/crime-hotspots" element={<CrimeHotspots />} />
              <Route path="dashboard/response-time" element={<ResponseTime />} />
              <Route path="dashboard/fake-reports" element={<FakeReports />} />
            </Route>
            
            <Route path="/index" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

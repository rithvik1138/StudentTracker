import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Auth from '@/pages/Auth';
import DashboardLayout from "@/components/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Subjects from "@/pages/Subjects";
import Grades from "@/pages/Grades";
import Attendance from "@/pages/Attendance";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route 
      path="/auth" 
      element={
        <PublicRoute>
          <Auth />
        </PublicRoute>
      } 
    />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/subjects" element={
      <ProtectedRoute>
        <DashboardLayout>
          <Subjects />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/grades" element={
      <ProtectedRoute>
        <DashboardLayout>
          <Grades />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/attendance" element={
      <ProtectedRoute>
        <DashboardLayout>
          <Attendance />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/attendance-management" element={
      <ProtectedRoute>
        <DashboardLayout>
          <Attendance />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/grade-management" element={
      <ProtectedRoute>
        <DashboardLayout>
          <Grades />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext.jsx";
import Auth from "@/pages/Auth.jsx";
import DashboardLayout from "@/components/DashboardLayout.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import Subjects from "@/pages/Subjects.jsx";
import Grades from "@/pages/Grades.jsx";
import Attendance from "@/pages/Attendance.jsx";
import Students from "@/pages/Students.jsx";
import Teachers from "@/pages/Teachers.jsx";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={
      <PublicRoute>
        <Auth />
      </PublicRoute>
    } />
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
    <Route path="/students" element={
      <ProtectedRoute>
        <DashboardLayout>
          <Students />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/teachers" element={
      <ProtectedRoute>
        <DashboardLayout>
          <Teachers />
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
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
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

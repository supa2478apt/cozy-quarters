import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Buildings from "./pages/admin/Buildings";
import Rooms from "./pages/admin/Rooms";
import Tenants from "./pages/admin/Tenants";
import Contracts from "./pages/admin/Contracts";
import Bills from "./pages/admin/Bills";
import Meters from "./pages/admin/Meters";
import Reports from "./pages/admin/Reports";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import TenantBills from "./pages/tenant/TenantBills";
import TenantPayment from "./pages/tenant/TenantPayment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type DemoRole = "admin" | "tenant" | null;

const App = () => {
  const [demoRole, setDemoRole] = useState<DemoRole>(null);

  const handleDemoLogin = (role: "admin" | "tenant") => setDemoRole(role);
  const handleSignOut = () => setDemoRole(null);
  const handleLogin = async () => { /* Firebase auth handled in production */ };

  if (!demoRole) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginPage onLogin={handleLogin} onDemoLogin={handleDemoLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {demoRole === "admin" ? (
              <Route
                path="/admin"
                element={
                  <DashboardLayout
                    role="admin"
                    userName="Admin User"
                    userEmail="admin@dormmanager.com"
                    onSignOut={handleSignOut}
                  />
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="buildings" element={<Buildings />} />
                <Route path="rooms" element={<Rooms />} />
                <Route path="tenants" element={<Tenants />} />
                <Route path="contracts" element={<Contracts />} />
                <Route path="bills" element={<Bills />} />
                <Route path="meters" element={<Meters />} />
                <Route path="reports" element={<Reports />} />
              </Route>
            ) : (
              <Route
                path="/tenant"
                element={
                  <DashboardLayout
                    role="tenant"
                    userName="Somchai Jaidee"
                    userEmail="somchai@email.com"
                    onSignOut={handleSignOut}
                  />
                }
              >
                <Route index element={<TenantDashboard />} />
                <Route path="bills" element={<TenantBills />} />
                <Route path="payment" element={<TenantPayment />} />
              </Route>
            )}
            <Route path="/" element={<Navigate to={demoRole === "admin" ? "/admin" : "/tenant"} replace />} />
            <Route path="*" element={<Navigate to={demoRole === "admin" ? "/admin" : "/tenant"} replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

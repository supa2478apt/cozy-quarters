import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { LoginPage } from "./pages/Login";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/admin/Dashboard";
import Buildings from "./pages/admin/Buildings";
import Rooms from "./pages/admin/Rooms";
import Tenants from "./pages/admin/Tenants";
import Contracts from "./pages/admin/Contracts";
import Bills from "./pages/admin/Bills";
import BillDetail from "./pages/admin/BillDetail";
import Receipts from "@/pages/admin/Receipts";
import Meters from "./pages/admin/Meters";
import Reports from "./pages/admin/Reports";

import TenantDashboard from "./pages/tenant/TenantDashboard";
import TenantBills from "./pages/tenant/TenantBills";
import TenantPayment from "./pages/tenant/TenantPayment";
import NotFound from "./pages/NotFound";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const queryClient = new QueryClient();

const App = () => {
  const [userRole, setUserRole] = useState<"admin" | "tenant" | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {
          const data = snap.data();
          setUserRole(data.role);
          setUserName(data.name || "");
          setUserEmail(data.email || "");
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setUserRole(null);
  };

  if (loading) {
  return <div style={{ padding: 50 }}>Loading...</div>;
}


  // 🔐 ถ้ายังไม่ login
  if (!userRole) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginPage />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <Routes>
            {userRole === "admin" ? (
              <Route
                path="/admin"
                element={
                  <DashboardLayout
                    role="admin"
                    userName={userName}
                    userEmail={userEmail}
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
                <Route path="bills/:id" element={<BillDetail />} />
                <Route path="receipts" element={<Receipts />} />
                <Route path="meters" element={<Meters />} />
                <Route path="reports" element={<Reports />} />
              </Route>
            ) : (
              <Route
                path="/tenant"
                element={
                  <DashboardLayout
                    role="tenant"
                    userName={userName}
                    userEmail={userEmail}
                    onSignOut={handleSignOut}
                  />
                }
              >
                <Route index element={<TenantDashboard />} />
                <Route path="bills" element={<TenantBills />} />
                <Route path="payment" element={<TenantPayment />} />
              </Route>
            )}

            <Route
              path="/"
              element={
                <Navigate
                  to={userRole === "admin" ? "/admin" : "/tenant"}
                  replace
                />
              }
            />

            <Route
              path="*"
              element={
                <Navigate
                  to={userRole === "admin" ? "/admin" : "/tenant"}
                  replace
                />
              }
            />
          </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
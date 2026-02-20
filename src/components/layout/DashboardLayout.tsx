import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { collection, query, where, onSnapshot , orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface DashboardLayoutProps {
  role: "admin" | "tenant";
  userName?: string;
  userEmail?: string;
  onSignOut: () => void;
}

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/buildings": "Buildings",
  "/admin/rooms": "Rooms",
  "/admin/tenants": "Tenants",
  "/admin/contracts": "Contracts",
  "/admin/bills": "Billing & Invoices",
  "/admin/meters": "Utility Meters",
  "/admin/reports": "Reports",
  "/tenant": "My Dashboard",
  "/tenant/bills": "My Bills",
  "/tenant/contract": "My Contract",
  "/tenant/payment": "Pay Now",
};

export function DashboardLayout({ role, userName, userEmail, onSignOut }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "Dashboard";
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingBills, setPendingBills] = useState<any[]>([]);


  useEffect(() => {
    if (role !== "admin") {
      setPendingCount(0);
      setPendingBills([]);
      return;
    }

    const q = query(
      collection(db, "bills"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bills = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPendingBills(bills);
      setPendingCount(snapshot.size);
    });

    return () => unsubscribe();
  }, [role]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar role={role} onSignOut={onSignOut} buildingName="The Grand Residence" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10">
            <Sidebar role={role} onSignOut={onSignOut} buildingName="The Grand Residence" />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-sidebar text-sidebar-foreground"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="font-semibold text-sm">{title}</span>
        </div>

        {/* Desktop top bar */}
        <div className="hidden md:block">
          <TopBar
            title={title}
            userName={userName}
            userEmail={userEmail}
            role={role}
            onSignOut={onSignOut}
            notifications={pendingCount}
            pendingBills={pendingBills}
          />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

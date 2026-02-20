import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  DoorOpen,
  Users,
  FileText,
  Receipt,
  Gauge,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Home,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: "admin" | "tenant";
  onSignOut: () => void;
  buildingName?: string;
}

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/buildings", label: "Buildings", icon: Building2 },
  { to: "/admin/rooms", label: "Rooms", icon: DoorOpen },
  { to: "/admin/tenants", label: "Tenants", icon: Users },
  { to: "/admin/contracts", label: "Contracts", icon: FileText },
  { to: "/admin/bills", label: "Billing", icon: Landmark },
  { to: "/admin/receipts", label: "Receipts", icon: Receipt },
  { to: "/admin/meters", label: "Meters", icon: Gauge },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
];

const tenantNav = [
  { to: "/tenant", label: "My Dashboard", icon: Home, end: true },
  { to: "/tenant/bills", label: "My Bills", icon: Receipt },
  { to: "/tenant/contract", label: "My Contract", icon: FileText },
  { to: "/tenant/payment", label: "Pay Now", icon: Gauge },
];

export function Sidebar({ role, onSignOut, buildingName }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const nav = role === "admin" ? adminNav : tenantNav;

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen bg-sidebar transition-all duration-300 ease-in-out shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-sidebar-border", collapsed && "justify-center px-2")}>
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sidebar-foreground font-semibold text-sm leading-tight truncate">DormManager</p>
            {buildingName && (
              <p className="text-sidebar-foreground/50 text-xs truncate">{buildingName}</p>
            )}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
        <div className="space-y-0.5">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-teal text-white shadow-glow"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center px-0"
                )
              }
              title={collapsed ? label : undefined}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" size={18} />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-2 space-y-0.5">
        <button
          onClick={onSignOut}
          className={cn(
            "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-rose transition-all duration-150",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-card border border-border shadow-sm text-muted-foreground hover:text-foreground hover:shadow-md transition-all"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}

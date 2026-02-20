import { Bell, Search, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  title: string;
  userName?: string;
  userEmail?: string;
  role?: string;
  onSignOut: () => void;
  notifications?: number;
  pendingBills?: any[];
}

export function TopBar({ title, userName, userEmail, role, onSignOut, notifications = 0, pendingBills = [] }: TopBarProps) {
  const navigate = useNavigate();
  return (
    <header className="h-14 flex items-center justify-between px-6 bg-card border-b border-border shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Bell size={18} />
              {notifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 text-[10px] flex items-center justify-center"
                >
                  {notifications}
                </Badge>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-3 py-2 font-medium text-sm border-b">
              Pending Bills ({notifications})
            </div>

            <div className="max-h-72 overflow-y-auto">
              {pendingBills.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No pending bills
                </div>
              ) : (
                pendingBills.slice(0, 5).map((bill) => (
                  <DropdownMenuItem
                    key={bill.id}
                    onClick={() => navigate(`/admin/bills/${bill.id}`)}
                    className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                  >
                    <div className="text-sm font-medium">
                      {bill.tenantName} - {bill.roomNumber}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      ชำระค่าห้อง - ฿{bill.totalAmount?.toLocaleString()}
                    </div>
                  </DropdownMenuItem>
                ))

              )}
            </div>
          </DropdownMenuContent>

        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-teal text-white text-xs font-semibold">
                {userName?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-foreground leading-tight">{userName ?? "User"}</p>
                <p className="text-xs text-muted-foreground capitalize">{role ?? "user"}</p>
              </div>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{userName ?? "User"}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose focus:text-rose" onClick={onSignOut}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

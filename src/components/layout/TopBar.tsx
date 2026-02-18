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

interface TopBarProps {
  title: string;
  userName?: string;
  userEmail?: string;
  role?: string;
  onSignOut: () => void;
  notifications?: number;
}

export function TopBar({ title, userName, userEmail, role, onSignOut, notifications = 3 }: TopBarProps) {
  return (
    <header className="h-14 flex items-center justify-between px-6 bg-card border-b border-border shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Bell size={18} />
          {notifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose rounded-full" />
          )}
        </button>

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

import { useState } from "react";
import { Plus, Search, Phone, Mail, Calendar, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockTenants, mockRooms } from "@/data/mockData";

export default function Tenants() {
  const [search, setSearch] = useState("");

  const filtered = mockTenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search tenants..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button className="bg-teal hover:bg-teal-dark text-white gap-2 h-9">
          <Plus size={15} />
          Add Tenant
        </Button>
      </div>

      <div className="bg-card rounded-xl card-shadow border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Tenant", "Contact", "Room", "Move-in Date", "Status"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(tenant => {
                const room = mockRooms.find(r => r.id === tenant.roomId);
                const isActive = !tenant.moveOutDate || tenant.moveOutDate > new Date();
                return (
                  <tr key={tenant.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center text-white font-semibold text-sm shrink-0">
                          {tenant.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{tenant.name}</p>
                          <p className="text-xs text-muted-foreground">{tenant.idCard}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone size={11} />
                          {tenant.phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail size={11} />
                          {tenant.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <DoorOpen size={14} className="text-muted-foreground" />
                        <span className="font-medium text-foreground">Room {room?.roomNumber}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Floor {room?.floor}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar size={13} />
                        {tenant.moveInDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? "status-paid" : "bg-muted text-muted-foreground border border-border"}`}>
                        {isActive ? "Active" : "Moved Out"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-medium">No tenants found</p>
          </div>
        )}
      </div>
    </div>
  );
}

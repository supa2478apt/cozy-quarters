import { useState } from "react";
import { Plus, Save, Zap, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockMeters, mockRooms, mockTenants } from "@/data/mockData";

export default function Meters() {
  const [month] = useState("2025-01");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Record water & electricity readings — {month}</p>
        </div>
        <Button className="bg-teal hover:bg-teal-dark text-white gap-2">
          <Plus size={16} />
          Add Reading
        </Button>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border card-shadow flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-100">
            <Droplets size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Water Rate</p>
            <p className="text-foreground font-bold text-lg">฿10<span className="text-muted-foreground font-normal text-sm">/unit</span></p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border card-shadow flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-100">
            <Zap size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Electric Rate</p>
            <p className="text-foreground font-bold text-lg">฿10<span className="text-muted-foreground font-normal text-sm">/unit</span></p>
          </div>
        </div>
      </div>

      {/* Meters table */}
      <div className="bg-card rounded-xl card-shadow border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">Room</th>
                <th className="text-left px-4 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">Tenant</th>
                <th className="text-center px-4 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">
                  <div className="flex items-center justify-center gap-1"><Droplets size={12} /> Water (Prev → Cur)</div>
                </th>
                <th className="text-right px-4 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">W.Usage</th>
                <th className="text-right px-4 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">W.Cost</th>
                <th className="text-center px-4 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">
                  <div className="flex items-center justify-center gap-1"><Zap size={12} /> Electric (Prev → Cur)</div>
                </th>
                <th className="text-right px-4 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">E.Usage</th>
                <th className="text-right px-4 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">E.Cost</th>
                <th className="text-center px-4 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockMeters.map(meter => {
                const room = mockRooms.find(r => r.id === meter.roomId);
                const tenant = mockTenants.find(t => t.roomId === meter.roomId);
                return (
                  <tr key={meter.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-foreground">Room {room?.roomNumber}</td>
                    <td className="px-4 py-4 text-muted-foreground text-sm">{tenant?.name ?? "—"}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-blue-600">
                        <span className="bg-blue-50 px-2 py-0.5 rounded font-mono text-xs">{meter.waterPrev}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs font-semibold">{meter.waterCurrent}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-medium">{meter.waterUsage} <span className="text-muted-foreground text-xs">u</span></td>
                    <td className="px-4 py-4 text-right text-blue-600 font-semibold">฿{(meter.waterUsage * meter.waterRate).toLocaleString()}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-amber-600">
                        <span className="bg-amber-50 px-2 py-0.5 rounded font-mono text-xs">{meter.electricPrev}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="bg-amber-100 px-2 py-0.5 rounded font-mono text-xs font-semibold">{meter.electricCurrent}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-medium">{meter.electricUsage} <span className="text-muted-foreground text-xs">u</span></td>
                    <td className="px-4 py-4 text-right text-amber-600 font-semibold">฿{(meter.electricUsage * meter.electricRate).toLocaleString()}</td>
                    <td className="px-4 py-4 text-center">
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                        <Save size={14} className="text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

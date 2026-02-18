import { useState } from "react";
import { Plus, Building2, MapPin, Layers, DoorOpen, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockDorms, mockRooms } from "@/data/mockData";

export default function Buildings() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Manage all your properties</p>
        </div>
        <Button className="bg-teal hover:bg-teal-dark text-white gap-2">
          <Plus size={16} />
          Add Building
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {mockDorms.map((dorm) => {
          const rooms = mockRooms.filter(r => r.dormId === dorm.id);
          const occupied = rooms.filter(r => r.status === "occupied").length;
          const vacant = rooms.filter(r => r.status === "vacant").length;
          const rate = rooms.length > 0 ? Math.round((occupied / rooms.length) * 100) : 0;

          return (
            <div
              key={dorm.id}
              className="bg-card rounded-xl card-shadow border border-border overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => setSelected(selected === dorm.id ? null : dorm.id)}
            >
              {/* Header */}
              <div className="h-24 bg-sidebar sidebar-gradient relative overflow-hidden">
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-teal/10" />
                <div className="absolute top-4 left-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal/20 border border-teal/30">
                    <Building2 size={20} className="text-teal-light" />
                  </div>
                </div>
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100">
                    <Edit2 size={12} className="text-white" />
                  </button>
                  <button className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/40 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={12} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-foreground text-base mb-1">{dorm.name}</h3>
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-4">
                  <MapPin size={12} />
                  <span className="truncate">{dorm.address}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2.5 rounded-lg bg-muted/60">
                    <p className="text-foreground font-bold text-lg">{dorm.totalFloors}</p>
                    <p className="text-muted-foreground text-xs">Floors</p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-muted/60">
                    <p className="text-foreground font-bold text-lg">{occupied}</p>
                    <p className="text-muted-foreground text-xs">Occupied</p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-muted/60">
                    <p className="text-foreground font-bold text-lg">{vacant}</p>
                    <p className="text-muted-foreground text-xs">Vacant</p>
                  </div>
                </div>

                {/* Occupancy bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Occupancy</span>
                    <span className="font-semibold text-teal">{rate}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal rounded-full transition-all duration-500"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add new building card */}
        <button className="bg-card rounded-xl border-2 border-dashed border-border hover:border-teal/50 hover:bg-teal-light/30 transition-all duration-200 p-8 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-teal min-h-[220px]">
          <div className="w-12 h-12 rounded-xl border-2 border-dashed border-current flex items-center justify-center">
            <Plus size={22} />
          </div>
          <span className="text-sm font-medium">Add New Building</span>
        </button>
      </div>
    </div>
  );
}

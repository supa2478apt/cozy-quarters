import { useState } from "react";
import { Plus, Search, Filter, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockRooms, mockTenants } from "@/data/mockData";
import { RoomStatus } from "@/types";

const statusOrder: RoomStatus[] = ["occupied", "vacant", "maintenance", "reserved"];

function RoomCard({ room }: { room: typeof mockRooms[0] }) {
  const tenant = mockTenants.find(t => t.roomId === room.id);
  const statusLabel = room.status.charAt(0).toUpperCase() + room.status.slice(1);

  return (
    <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all duration-200 cursor-pointer group relative">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
            room.status === "occupied" ? "bg-blue-500" :
            room.status === "vacant" ? "bg-emerald-500" :
            room.status === "maintenance" ? "bg-amber-500" : "bg-violet-500"
          }`} />
          <span className="font-bold text-foreground text-lg">#{room.roomNumber}</span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full status-${room.status}`}>
          {statusLabel}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-3">Floor {room.floor}</p>

      {tenant && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-teal flex items-center justify-center text-white text-xs font-semibold">
            {tenant.name[0]}
          </div>
          <span className="text-sm text-foreground truncate">{tenant.name}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-sm font-semibold text-foreground">฿{room.monthlyRent.toLocaleString()}<span className="text-muted-foreground font-normal text-xs">/mo</span></span>
        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
          <Edit2 size={13} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

export default function Rooms() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<RoomStatus | "all">("all");

  const filtered = mockRooms.filter(r => {
    const matchStatus = filter === "all" || r.status === filter;
    const matchSearch = r.roomNumber.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Group by floor
  const floors = [...new Set(filtered.map(r => r.floor))].sort();

  const counts = {
    all: mockRooms.length,
    occupied: mockRooms.filter(r => r.status === "occupied").length,
    vacant: mockRooms.filter(r => r.status === "vacant").length,
    maintenance: mockRooms.filter(r => r.status === "maintenance").length,
    reserved: mockRooms.filter(r => r.status === "reserved").length,
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search rooms..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button className="bg-teal hover:bg-teal-dark text-white gap-2 h-9">
          <Plus size={15} />
          Add Room
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", ...statusOrder] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              filter === s
                ? "bg-teal text-white border-teal"
                : "bg-card text-muted-foreground border-border hover:border-teal/40 hover:text-teal"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Rooms by floor */}
      {floors.map(floor => (
        <div key={floor}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Floor {floor} — {filtered.filter(r => r.floor === floor).length} rooms
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {filtered.filter(r => r.floor === floor).map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No rooms found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
}

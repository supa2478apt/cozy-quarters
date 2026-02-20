import { useEffect, useState, useMemo } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Plus, Search, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type RoomStatus = "occupied" | "vacant" | "maintenance" | "reserved";

type Room = {
  id: string;
  apartmentId: string;
  createdAt?: any;
  floor: number;
  rentPrice: number;
  roomNumber: string;
  status: RoomStatus;
  tenantId?: string;
};

type Apartment = {
  id: string;
  name: string;
};

type Tenant = {
  id: string;
  name: string;
};

const statusOptions: RoomStatus[] = [
  "occupied",
  "vacant",
  "maintenance",
  "reserved",
];

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);

  const [form, setForm] = useState<Omit<Room, "id">>({
    apartmentId: "",
    floor: 1,
    rentPrice: 0,
    roomNumber: "",
    status: "vacant",
    tenantId: "",
  });

  /* ---------------- REALTIME ---------------- */

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "rooms"), (snap) => {
      setRooms(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Room, "id">),
        }))
      );
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "apartments"), (snap) => {
      setApartments(
        snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
        }))
      );
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tenants"), (snap) => {
      setTenants(
        snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
        }))
      );
    });
    return () => unsub();
  }, []);

  /* ---------------- SORT + GROUP ---------------- */

  const filtered = useMemo(() => {
    return rooms
      .filter((r) =>
        r.roomNumber.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        // sort อาคารก่อน
        if (a.apartmentId !== b.apartmentId) {
          return a.apartmentId.localeCompare(b.apartmentId);
        }

        // sort ชั้น
        if (a.floor !== b.floor) {
          return a.floor - b.floor;
        }

        // sort เลขห้องแบบ numeric
        return Number(a.roomNumber) - Number(b.roomNumber);
      });
  }, [rooms, search]);

  const grouped = useMemo(() => {
    const map: Record<string, Record<number, Room[]>> = {};

    filtered.forEach((room) => {
      if (!map[room.apartmentId]) {
        map[room.apartmentId] = {};
      }

      if (!map[room.apartmentId][room.floor]) {
        map[room.apartmentId][room.floor] = [];
      }

      map[room.apartmentId][room.floor].push(room);
    });

    return map;
  }, [filtered]);

  /* ---------------- CRUD ---------------- */

  const openAdd = () => {
    setEditing(null);
    setForm({
      apartmentId: "",
      floor: 1,
      rentPrice: 0,
      roomNumber: "",
      status: "vacant",
      tenantId: "",
    });
    setOpen(true);
  };

  const openEdit = (room: Room) => {
    setEditing(room);
    setForm({ ...room });
    setOpen(true);
  };

  const saveRoom = async () => {
    if (!form.apartmentId || !form.roomNumber) return;

    if (editing) {
      await updateDoc(doc(db, "rooms", editing.id), {
        ...form,
      });
    } else {
      await addDoc(collection(db, "rooms"), {
        ...form,
        createdAt: serverTimestamp(),
      });
    }

    setOpen(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9 h-9"
            placeholder="Search room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button onClick={openAdd} className="bg-teal text-white gap-2">
          <Plus size={15} />
          เพิ่มห้อง
        </Button>
      </div>

      {/* GROUPED VIEW */}
      {Object.entries(grouped).map(([apartmentId, floors]) => {
        const apartment = apartments.find(a => a.id === apartmentId);

        return (
          <div key={apartmentId} className="space-y-6">

            {/* อาคาร */}
            <div className="text-xl font-bold border-b pb-2">
              🏢 {apartment?.name || "ไม่พบชื่ออาคาร"}
            </div>

            {Object.entries(floors)
              .sort((a, b) => Number(a[0]) - Number(b[0]))
              .map(([floor, rooms]) => (
                <div key={floor} className="space-y-4">

                  {/* ชั้น */}
                  <div className="text-lg font-semibold text-muted-foreground">
                    ชั้น {floor}
                  </div>

                  {/* ห้องในชั้น */}
                  <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
                    {rooms.map((room) => {
                      const tenant = tenants.find(t => t.id === room.tenantId);

                      return (
                        <div
                          key={room.id}
                          className="bg-card border rounded-xl p-4 relative group hover:shadow-md transition"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-lg">
                              {room.roomNumber}
                            </span>
                            <button
                              onClick={() => openEdit(room)}
                              className="opacity-0 group-hover:opacity-100"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>

                          {tenant && (
                            <p className="text-sm">
                              👤 {tenant.name}
                            </p>
                          )}

                          <div className="mt-3 text-sm font-semibold">
                            ฿{room.rentPrice.toLocaleString()}
                          </div>

                          <div className="text-xs capitalize text-muted-foreground">
                            {room.status}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        );
      })}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "แก้ไขห้อง" : "เพิ่มห้อง"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <div>
              <label className="text-sm font-medium">อาคาร</label>
              <select
                className="w-full border rounded-md h-10 px-2"
                value={form.apartmentId}
                onChange={(e) =>
                  setForm({ ...form, apartmentId: e.target.value })
                }
              >
                <option value="">เลือกอาคาร</option>
                {apartments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">เลขห้อง</label>
              <Input
                value={form.roomNumber}
                onChange={(e) =>
                  setForm({ ...form, roomNumber: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">ชั้น</label>
              <Input
                type="number"
                value={form.floor}
                onChange={(e) =>
                  setForm({ ...form, floor: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">ค่าเช่า</label>
              <Input
                type="number"
                value={form.rentPrice}
                onChange={(e) =>
                  setForm({ ...form, rentPrice: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">สถานะ</label>
              <select
                className="w-full border rounded-md h-10 px-2"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as RoomStatus })
                }
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">ผู้เช่า</label>
              <select
                className="w-full border rounded-md h-10 px-2"
                value={form.tenantId}
                onChange={(e) =>
                  setForm({ ...form, tenantId: e.target.value })
                }
              >
                <option value="">ไม่มี</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={saveRoom}
              className="w-full bg-teal text-white"
            >
              บันทึก
            </Button>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
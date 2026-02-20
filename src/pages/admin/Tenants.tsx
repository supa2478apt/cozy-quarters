import { useEffect, useState, useMemo } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Plus, Search, Phone, Calendar, DoorOpen, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TenantStatus = "active" | "left";

type Tenant = {
  id: string;
  apartmentId: string;
  createdAt?: any;
  idCard: string;
  name: string;
  phone: string;
  room: string;
  roomId: string;
  startDate: any;
  status: TenantStatus;
};

type Apartment = {
  id: string;
  name: string;
};

type RoomStatus = "occupied" | "vacant" | "maintenance" | "reserved";

type Room = {
  id: string;
  apartmentId: string;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  tenantId?: string;
};

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tenant | null>(null);

  const [form, setForm] = useState<Omit<Tenant, "id">>({
    apartmentId: "",
    idCard: "",
    name: "",
    phone: "",
    room: "",
    roomId: "",
    startDate: "",
    status: "active",
  });

  /* ---------------- REALTIME ---------------- */

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tenants"), (snap) => {
      setTenants(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Tenant, "id">),
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

  /* ---------------- FILTER ---------------- */

  const filtered = useMemo(() => {
    return tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.phone.includes(search) ||
        t.idCard.includes(search)
    );
  }, [tenants, search]);

  /* ---------------- CRUD ---------------- */

  const openAdd = () => {
    setEditing(null);
    setForm({
      apartmentId: "",
      idCard: "",
      name: "",
      phone: "",
      room: "",
      roomId: "",
      startDate: "",
      status: "active",
    });
    setOpen(true);
  };

  const openEdit = (tenant: Tenant) => {
    setEditing(tenant);
    setForm({ ...tenant });
    setOpen(true);
  };

  const saveTenant = async () => {
    if (!form.name || !form.roomId) return;

    const selectedRoom = rooms.find(r => r.id === form.roomId);

    const payload = {
      ...form,
      room: selectedRoom?.roomNumber || "",
      startDate: form.startDate
        ? new Date(form.startDate)
        : serverTimestamp(),
    };

    // ---------------- UPDATE ROOM STATUS ----------------

    // ถ้าแก้ไข
    if (editing) {

      // ถ้าเปลี่ยนห้อง
      if (editing.roomId !== form.roomId) {
        // ห้องเก่า -> vacant
        await updateDoc(doc(db, "rooms", editing.roomId), {
          status: "vacant",
          tenantId: "",
        });

        // ห้องใหม่ -> occupied
        await updateDoc(doc(db, "rooms", form.roomId), {
          status: "occupied",
          tenantId: editing.id,
        });
      }

      // ถ้าเปลี่ยนเป็น left
      if (form.status === "left") {
        await updateDoc(doc(db, "rooms", form.roomId), {
          status: "vacant",
          tenantId: "",
        });
      }

      // ถ้า active
      if (form.status === "active") {
        await updateDoc(doc(db, "rooms", form.roomId), {
          status: "occupied",
          tenantId: editing.id,
        });
      }

      await updateDoc(doc(db, "tenants", editing.id), payload);

    } else {
      // เพิ่มใหม่

      const newTenant = await addDoc(collection(db, "tenants"), {
        ...payload,
        createdAt: serverTimestamp(),
      });

      // อัปเดต room เป็น occupied
      await updateDoc(doc(db, "rooms", form.roomId), {
        status: "occupied",
        tenantId: newTenant.id,
      });
    }

    setOpen(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tenants..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button onClick={openAdd} className="bg-teal text-white gap-2">
          <Plus size={15} />
          เพิ่มผู้เช่า
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 border-b">
            <tr>
              <th className="px-4 py-3 text-left">ชื่อ</th>
              <th className="px-4 py-3 text-left">เบอร์โทร</th>
              <th className="px-4 py-3 text-left">ห้อง</th>
              <th className="px-4 py-3 text-left">วันที่เข้าอยู่</th>
              <th className="px-4 py-3 text-left">สถานะ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tenant) => {
              const room = rooms.find(r => r.id === tenant.roomId);
              const apartment = apartments.find(a => a.id === tenant.apartmentId);

              return (
                <tr key={tenant.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">
                    {tenant.name}
                    <div className="text-xs text-muted-foreground">
                      {tenant.idCard}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Phone size={13} />
                      {tenant.phone}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <DoorOpen size={13} />
                      {apartment?.name} / ห้อง {room?.roomNumber}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={13} />
                      {tenant.startDate?.seconds
                        ? new Date(tenant.startDate.seconds * 1000).toLocaleDateString("th-TH")
                        : ""}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${tenant.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                      }`}>
                      {tenant.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(tenant)}>
                      <Edit2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            ไม่พบข้อมูลผู้เช่า
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "แก้ไขผู้เช่า" : "เพิ่มผู้เช่า"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <Input
              placeholder="ชื่อ"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <Input
              placeholder="เลขบัตรประชาชน"
              value={form.idCard}
              onChange={(e) => setForm({ ...form, idCard: e.target.value })}
            />

            <Input
              placeholder="เบอร์โทร"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            {/* Apartment */}
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

            {/* Room */}
            <select
              className="w-full border rounded-md h-10 px-2"
              value={form.roomId}
              onChange={(e) =>
                setForm({ ...form, roomId: e.target.value })
              }
            >
              <option value="">เลือกห้อง</option>
              {rooms
                .filter(r =>
                  r.apartmentId === form.apartmentId &&
                  (r.status === "vacant" || r.id === form.roomId)
                )
                .map((room) => (
                  <option key={room.id} value={room.id}>
                    ห้อง {room.roomNumber} (ชั้น {room.floor})
                  </option>
                ))}
            </select>

            <Input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
            />

            <select
              className="w-full border rounded-md h-10 px-2"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as TenantStatus })
              }
            >
              <option value="active">active</option>
              <option value="left">left</option>
            </select>

            <Button
              onClick={saveTenant}
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
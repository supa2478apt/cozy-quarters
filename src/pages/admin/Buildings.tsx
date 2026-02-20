import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  Plus,
  Building2,
  MapPin,
  Edit2,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Apartment = {
  id: string;
  address: string;
  code: string;
  name: string;
  status: string;
  totalFloors: number;
  totalRooms: number;
};

export default function Buildings() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Apartment | null>(null);

  const [form, setForm] = useState({
    address: "",
    code: "",
    name: "",
    status: "active",
    totalFloors: 1,
    totalRooms: 0,
  });

  // 🔥 Realtime Apartments
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "apartments"), (snap) => {
      const data: Apartment[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Apartment, "id">),
      }));
      setApartments(data);
    });

    return () => unsub();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      address: "",
      code: "",
      name: "",
      status: "active",
      totalFloors: 1,
      totalRooms: 0,
    });
    setOpen(true);
  };

  const openEdit = (apt: Apartment) => {
    setEditing(apt);
    setForm({
      address: apt.address,
      code: apt.code,
      name: apt.name,
      status: apt.status,
      totalFloors: apt.totalFloors,
      totalRooms: apt.totalRooms,
    });
    setOpen(true);
  };

  const saveApartment = async () => {
    if (!form.code.trim() || !form.name.trim()) return;

    if (editing) {
      // 🔥 update
      await updateDoc(doc(db, "apartments", editing.id), {
        ...form,
      });
    } else {
      // 🔥 create (Document ID = code)
      await setDoc(doc(db, "apartments", form.code), {
        ...form,
        createdAt: serverTimestamp(),
      });
    }

    setOpen(false);
  };

  const removeApartment = async (id: string) => {
    if (!confirm("ลบอาคารนี้ใช่หรือไม่?")) return;
    await deleteDoc(doc(db, "apartments", id));
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Manage all your properties
        </p>

        <Button
          className="bg-teal hover:bg-teal-dark text-white gap-2"
          onClick={openAdd}
        >
          <Plus size={16} />
          เพิ่มอาคาร
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {apartments.map((apt) => (
          <div
            key={apt.id}
            className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 group"
          >
            {/* Header */}
            <div className="h-24 bg-sidebar relative">
              <div className="absolute top-3 right-3 flex gap-1.5">
                <button
                  onClick={() => openEdit(apt)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 opacity-0 group-hover:opacity-100"
                >
                  <Edit2 size={12} className="text-white" />
                </button>

                <button
                  onClick={() => removeApartment(apt.id)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/40 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={12} className="text-white" />
                </button>
              </div>

              <div className="absolute top-4 left-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal/20">
                  <Building2 size={20} />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-semibold text-base mb-1">
                {apt.name}
              </h3>

              <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-3">
                <MapPin size={12} />
                <span className="truncate">
                  {apt.address}
                </span>
              </div>

              <div className="text-sm space-y-1">
                <p>Code: {apt.code}</p>
                <p>Floors: {apt.totalFloors}</p>
                <p>Total Rooms: {apt.totalRooms}</p>
                <p>Status: {apt.status}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Add Card */}
        <button
          onClick={openAdd}
          className="bg-card rounded-xl border-2 border-dashed border-border hover:border-teal/50 transition-all duration-200 p-8 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-teal min-h-[220px]"
        >
          <Plus size={22} />
          <span className="text-sm font-medium">
            Add New Building
          </span>
        </button>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "แก้ไขอาคาร" : "เพิ่มอาคาร"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            {/* Code */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Code (Document ID)
              </label>
              <Input
                value={form.code}
                disabled={!!editing}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
              />
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                ชื่ออาคาร
              </label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                ที่อยู่
              </label>
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>

            {/* Floors */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                จำนวนชั้น
              </label>
              <Input
                type="number"
                min={1}
                value={form.totalFloors}
                onChange={(e) =>
                  setForm({
                    ...form,
                    totalFloors: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* Total Rooms */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                จำนวนห้องทั้งหมด
              </label>
              <Input
                type="number"
                min={0}
                value={form.totalRooms}
                onChange={(e) =>
                  setForm({
                    ...form,
                    totalRooms: Number(e.target.value),
                  })
                }
              />
            </div>

            <Button
              className="w-full bg-teal text-white"
              onClick={saveApartment}
            >
              บันทึก
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
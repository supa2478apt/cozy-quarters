import { useEffect, useState, useMemo } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Building2, Zap, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Room = {
  id: string;
  roomNumber: string;
  apartmentId: string;
};

type Apartment = {
  id: string;
  name: string;
};

type Meter = {
  id: string;
  roomId: string;
  apartmentId: string;
  month: string;
  waterPrev: number;
  waterCurrent: number;
  waterUsage: number;
  waterRate: number;
  electricPrev: number;
  electricCurrent: number;
  electricUsage: number;
  electricRate: number;
};

export default function Meters() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [meters, setMeters] = useState<Meter[]>([]);

  const [selectedRoom, setSelectedRoom] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const [waterPrev, setWaterPrev] = useState(0);
  const [waterCurrent, setWaterCurrent] = useState(0);
  const [electricPrev, setElectricPrev] = useState(0);
  const [electricCurrent, setElectricCurrent] = useState(0);

  const waterRate = 22;
  const electricRate = 7;

  /* ---------------- LOAD FIREBASE ---------------- */

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "rooms"), snap => {
      setRooms(snap.docs.map(d => ({ id: d.id, ...(d.data() as Room) })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "apartments"), snap => {
      setApartments(snap.docs.map(d => ({ id: d.id, ...(d.data() as Apartment) })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "meters"), snap => {
      setMeters(snap.docs.map(d => ({ id: d.id, ...(d.data() as Meter) })));
    });
    return () => unsub();
  }, []);

  /* ---------------- GROUP ROOMS ---------------- */

  const apartmentMap = useMemo(() => {
    const map: Record<string, string> = {};
    apartments.forEach(a => (map[a.id] = a.name));
    return map;
  }, [apartments]);

  const groupedRooms = useMemo(() => {
    const sorted = [...rooms].sort((a, b) => {
      if (a.apartmentId === b.apartmentId) {
        return Number(a.roomNumber) - Number(b.roomNumber);
      }
      return a.apartmentId.localeCompare(b.apartmentId);
    });

    return sorted.reduce((acc, room) => {
      if (!acc[room.apartmentId]) acc[room.apartmentId] = [];
      acc[room.apartmentId].push(room);
      return acc;
    }, {} as Record<string, Room[]>);
  }, [rooms]);

  /* ---------------- AUTO LOAD PREVIOUS ---------------- */

  useEffect(() => {
    if (!selectedRoom) return;

    const loadLast = async () => {
      const q = query(
        collection(db, "meters"),
        where("roomId", "==", selectedRoom),
        orderBy("month", "desc"),
        limit(1)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        const last = snap.docs[0].data() as Meter;
        setWaterPrev(last.waterCurrent);
        setElectricPrev(last.electricCurrent);
      } else {
        setWaterPrev(0);
        setElectricPrev(0);
      }
    };

    loadLast();
  }, [selectedRoom]);

  /* ---------------- SAVE ---------------- */

  const saveReading = async () => {
    if (!selectedRoom) return alert("กรุณาเลือกห้อง");

    if (waterCurrent < waterPrev || electricCurrent < electricPrev)
      return alert("ค่ามิเตอร์ปัจจุบันต้องมากกว่าค่าเดิม");

    const exists = meters.find(
      m => m.roomId === selectedRoom && m.month === month
    );

    if (exists) return alert("เดือนนี้บันทึกแล้ว");

    const room = rooms.find(r => r.id === selectedRoom);

    await addDoc(collection(db, "meters"), {
      roomId: selectedRoom,
      apartmentId: room?.apartmentId,
      month,
      waterPrev,
      waterCurrent,
      waterUsage: waterCurrent - waterPrev,
      waterRate,
      electricPrev,
      electricCurrent,
      electricUsage: electricCurrent - electricPrev,
      electricRate,
      createdAt: serverTimestamp(),
    });

    alert("บันทึกสำเร็จ");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Building2 size={20} />
          บันทึกมิเตอร์
        </h2>
      </div>

      <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-5">

        {/* Month */}
        <div>
          <label className="text-sm font-medium">เดือน</label>
          <Input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
          />
        </div>

        {/* Room */}
        <div>
          <label className="text-sm font-medium">เลือกห้อง</label>
          <select
            className="w-full border rounded-md h-11 px-3"
            value={selectedRoom}
            onChange={e => setSelectedRoom(e.target.value)}
          >
            <option value="">-- เลือกห้อง --</option>

            {Object.entries(groupedRooms).map(([aptId, rooms]) => (
              <optgroup
                key={aptId}
                label={`อาคาร ${apartmentMap[aptId] ?? aptId}`}
              >
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>
                    ห้อง {r.roomNumber}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Water */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Droplets size={16} /> มิเตอร์น้ำ
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">เลขครั้งก่อน</label>
              <Input type="number" value={waterPrev} disabled />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">เลขปัจจุบัน</label>
              <Input
                type="number"
                value={waterCurrent}
                onChange={e => setWaterCurrent(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Electric */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Zap size={16} /> มิเตอร์ไฟ
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">เลขครั้งก่อน</label>
              <Input type="number" value={electricPrev} disabled />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">เลขปัจจุบัน</label>
              <Input
                type="number"
                value={electricCurrent}
                onChange={e => setElectricCurrent(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={saveReading}
          className="w-full bg-teal-600 hover:bg-teal-700"
        >
          บันทึกมิเตอร์
        </Button>
      </div>
    </div>
  );
}
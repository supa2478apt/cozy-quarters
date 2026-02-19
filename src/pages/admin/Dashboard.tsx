import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Users, DoorOpen, AlertCircle } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  colorClass,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: any;
  trend?: string;
  colorClass: string;
}) {
  return (
    <div className="bg-card rounded-xl p-5 card-shadow border border-border flex items-start gap-4 hover:shadow-lg transition-shadow duration-200">
      <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${colorClass}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-foreground text-2xl font-bold">{value}</p>
        {sub && <p className="text-muted-foreground text-xs mt-0.5">{sub}</p>}
        {trend && (
          <p className="text-emerald-600 text-xs font-medium mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> {trend}
          </p>
        )}
      </div>
    </div>
  );
}

const OCCUPANCY_COLORS = ["#0d9488", "#e2e8f0"];

export default function AdminDashboard() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [roomsSnap, tenantsSnap, billsSnap] = await Promise.all([
        getDocs(collection(db, "rooms")),
        getDocs(collection(db, "tenants")),
        getDocs(collection(db, "bills")),
      ]);

      setRooms(roomsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTenants(tenantsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setBills(billsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    fetchData();
  }, []);

  // ===== KPI CALC =====
  const totalRooms = rooms.length;
  const occupied = rooms.filter(r => r.status === "occupied").length;
  const occupancyRate =
    totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0;

  const unpaidBills = bills.filter(
    b => b.status === "unpaid" || b.status === "overdue"
  );

  const currentMonth = new Date().toISOString().slice(0, 7);

  const paidThisMonth = bills.filter(
    b => b.month === currentMonth && b.status === "paid"
  );

  const totalRevenue = paidThisMonth.reduce(
    (sum, b) => sum + (b.totalAmount || 0),
    0
  );

  // ===== REVENUE 6 MONTHS =====
  const monthlyRevenue = useMemo(() => {
    const months: any[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = d.toISOString().slice(0, 7);

      const total = bills
        .filter(b => b.month === monthKey && b.status === "paid")
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      months.push({
        month: d.toLocaleString("default", { month: "short" }),
        revenue: total,
      });
    }

    return months;
  }, [bills]);

  // ===== PIE DATA =====
  const occupancyData = [
    { name: "Occupied", value: occupied },
    { name: "Vacant", value: totalRooms - occupied },
  ];

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Monthly Revenue"
          value={`฿${totalRevenue.toLocaleString()}`}
          sub={currentMonth}
          icon={TrendingUp}
          colorClass="bg-teal"
        />
        <KpiCard
          label="Occupancy Rate"
          value={`${occupancyRate}%`}
          sub={`${occupied} of ${totalRooms} rooms`}
          icon={DoorOpen}
          colorClass="bg-blue-500"
        />
        <KpiCard
          label="Total Tenants"
          value={`${tenants.length}`}
          sub="Active tenants"
          icon={Users}
          colorClass="bg-violet-500"
        />
        <KpiCard
          label="Unpaid Bills"
          value={`${unpaidBills.length}`}
          sub={`฿${unpaidBills.reduce((s, b) => s + (b.totalAmount || 0), 0).toLocaleString()}`}
          icon={AlertCircle}
          colorClass="bg-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl p-5 card-shadow border border-border">
          <h3 className="font-semibold text-foreground mb-4">
            Revenue Overview
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v: number) => `฿${v.toLocaleString()}`} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0d9488"
                fill="#0d948833"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-5 card-shadow border border-border">
          <h3 className="font-semibold text-foreground mb-4">
            Room Status
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={occupancyData}
                dataKey="value"
                innerRadius={40}
                outerRadius={70}
              >
                {occupancyData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={OCCUPANCY_COLORS[index % OCCUPANCY_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

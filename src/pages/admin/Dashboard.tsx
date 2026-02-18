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
import { mockBills, mockRooms, mockTenants, monthlyRevenue, occupancyData } from "@/data/mockData";

function KpiCard({ label, value, sub, icon: Icon, trend, colorClass }: {
  label: string; value: string; sub?: string; icon: any; trend?: string; colorClass: string;
}) {
  return (
    <div className="bg-card rounded-xl p-5 card-shadow border border-border flex items-start gap-4 hover:shadow-lg transition-shadow duration-200">
      <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${colorClass}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
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

const OCCUPANCY_COLORS = ["#0d9488", "#e2e8f0", "#f59e0b", "#8b5cf6"];

export default function AdminDashboard() {
  const totalRooms = mockRooms.length;
  const occupied = mockRooms.filter(r => r.status === "occupied").length;
  const occupancyRate = Math.round((occupied / totalRooms) * 100);
  const unpaidBills = mockBills.filter(b => b.status === "unpaid" || b.status === "overdue");
  const paidThisMonth = mockBills.filter(b => b.month === "2025-01" && b.status === "paid");
  const totalRevenue = paidThisMonth.reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Monthly Revenue" value={`฿${totalRevenue.toLocaleString()}`} sub="January 2025" icon={TrendingUp} trend="+8.2% from last month" colorClass="bg-teal" />
        <KpiCard label="Occupancy Rate" value={`${occupancyRate}%`} sub={`${occupied} of ${totalRooms} rooms`} icon={DoorOpen} colorClass="bg-blue-500" />
        <KpiCard label="Total Tenants" value={`${mockTenants.length}`} sub="Active tenants" icon={Users} colorClass="bg-violet-500" />
        <KpiCard label="Unpaid Bills" value={`${unpaidBills.length}`} sub={`฿${unpaidBills.reduce((s, b) => s + b.totalAmount, 0).toLocaleString()} total`} icon={AlertCircle} colorClass="bg-red-500" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-card rounded-xl p-5 card-shadow border border-border">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground">Revenue Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 6 months</p>
            </div>
            <span className="text-xs bg-teal-light text-teal font-medium px-2.5 py-1 rounded-full border border-teal/20">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenue} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 92%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215, 16%, 50%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 16%, 50%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(214, 20%, 90%)", fontSize: "13px" }} formatter={(v: number) => [`฿${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: "#0d9488", r: 3, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy pie */}
        <div className="bg-card rounded-xl p-5 card-shadow border border-border">
          <h3 className="font-semibold text-foreground mb-1">Room Status</h3>
          <p className="text-xs text-muted-foreground mb-4">Current distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {occupancyData.map((_, index) => (
                  <Cell key={index} fill={OCCUPANCY_COLORS[index % OCCUPANCY_COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {occupancyData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: OCCUPANCY_COLORS[i] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent bills table */}
      <div className="bg-card rounded-xl card-shadow border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Bills</h3>
          <span className="text-xs text-muted-foreground">January 2025</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Room", "Tenant", "Rent", "Total", "Status"].map(h => (
                  <th key={h} className={`px-5 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide ${h === "Rent" || h === "Total" ? "text-right" : h === "Status" ? "text-center" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockBills.filter(b => b.month === "2025-01").map((bill) => {
                const room = mockRooms.find(r => r.id === bill.roomId);
                const tenant = mockTenants.find(t => t.id === bill.tenantId);
                return (
                  <tr key={bill.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-foreground">Room {room?.roomNumber}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{tenant?.name}</td>
                    <td className="px-4 py-3.5 text-right">฿{bill.rentAmount.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-foreground">฿{bill.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium status-${bill.status}`}>
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </span>
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

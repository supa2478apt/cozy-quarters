import { FileText, Download, BarChart3, TrendingUp, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { monthlyRevenue, mockRooms } from "@/data/mockData";

const vacancyData = [
  { month: "Oct", occupied: 9, vacant: 3 },
  { month: "Nov", occupied: 10, vacant: 2 },
  { month: "Dec", occupied: 10, vacant: 2 },
  { month: "Jan", occupied: 7, vacant: 3 },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">Financial and occupancy insights</p>
        <Button variant="outline" className="gap-2 h-9">
          <Download size={14} />
          Export Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue bar chart */}
        <div className="bg-card rounded-xl p-5 card-shadow border border-border">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-teal" />
            <h3 className="font-semibold text-foreground">Revenue Report</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-5">Monthly revenue vs target</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyRevenue} margin={{ left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 92%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215, 16%, 50%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 16%, 50%)" }} axisLine={false} tickLine={false} tickFormatter={v => `฿${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`฿${v.toLocaleString()}`, ""]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Legend iconType="circle" iconSize={8} />
              <Bar dataKey="revenue" name="Revenue" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vacancy chart */}
        <div className="bg-card rounded-xl p-5 card-shadow border border-border">
          <div className="flex items-center gap-2 mb-1">
            <DoorOpen size={16} className="text-teal" />
            <h3 className="font-semibold text-foreground">Occupancy Report</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-5">Occupied vs vacant rooms</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={vacancyData} margin={{ left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 92%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215, 16%, 50%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 16%, 50%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Legend iconType="circle" iconSize={8} />
              <Bar dataKey="occupied" name="Occupied" fill="#0d9488" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="vacant" name="Vacant" fill="#e2e8f0" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary table */}
      <div className="bg-card rounded-xl card-shadow border border-border">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <BarChart3 size={16} className="text-teal" />
          <h3 className="font-semibold text-foreground">Monthly Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Month", "Revenue", "Target", "Variance", "Occupancy", "Unpaid Bills"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyRevenue.map(row => {
                const variance = row.revenue - row.target;
                return (
                  <tr key={row.month} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-foreground">{row.month} 2024</td>
                    <td className="px-5 py-4 font-semibold text-teal">฿{row.revenue.toLocaleString()}</td>
                    <td className="px-5 py-4 text-muted-foreground">฿{row.target.toLocaleString()}</td>
                    <td className={`px-5 py-4 font-medium ${variance >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {variance >= 0 ? "+" : ""}฿{variance.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-foreground font-medium">
                        {Math.round((mockRooms.filter(r => r.status === "occupied").length / mockRooms.length) * 100)}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">—</td>
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

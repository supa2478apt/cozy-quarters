import { useState } from "react";
import { Plus, Download, Filter, CheckCircle2, AlertCircle, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockBills, mockRooms, mockTenants } from "@/data/mockData";
import { BillStatus } from "@/types";

const statusConfig = {
  paid: { label: "Paid", icon: CheckCircle2, class: "status-paid" },
  unpaid: { label: "Unpaid", icon: AlertCircle, class: "status-unpaid" },
  overdue: { label: "Overdue", icon: Clock, class: "status-overdue" },
  pending: { label: "Pending", icon: Zap, class: "status-pending" },
};

export default function Bills() {
  const [statusFilter, setStatusFilter] = useState<BillStatus | "all">("all");

  const filtered = statusFilter === "all" ? mockBills : mockBills.filter(b => b.status === statusFilter);

  const totals = {
    all: mockBills.length,
    paid: mockBills.filter(b => b.status === "paid").length,
    unpaid: mockBills.filter(b => b.status === "unpaid").length,
    overdue: mockBills.filter(b => b.status === "overdue").length,
    pending: mockBills.filter(b => b.status === "pending").length,
  };

  const totalUnpaid = mockBills.filter(b => b.status !== "paid").reduce((s, b) => s + b.totalAmount, 0);
  const totalCollected = mockBills.filter(b => b.status === "paid").reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border card-shadow">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Collected</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">฿{totalCollected.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{totals.paid} bills paid</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border card-shadow">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Outstanding</p>
          <p className="text-xl font-bold text-red-500 mt-1">฿{totalUnpaid.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{totals.unpaid + totals.overdue} bills pending</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border card-shadow">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Overdue</p>
          <p className="text-xl font-bold text-orange-500 mt-1">{totals.overdue}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Requires attention</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border card-shadow">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Awaiting</p>
          <p className="text-xl font-bold text-amber-500 mt-1">{totals.pending}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Slip uploaded</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          {(["all", "paid", "unpaid", "overdue", "pending"] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                statusFilter === s
                  ? "bg-teal text-white border-teal"
                  : "bg-card text-muted-foreground border-border hover:border-teal/40 hover:text-teal"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)} ({totals[s]})
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 h-9">
            <Download size={14} />
            Export
          </Button>
          <Button className="bg-teal hover:bg-teal-dark text-white gap-2 h-9">
            <Plus size={15} />
            Generate Bills
          </Button>
        </div>
      </div>

      {/* Bills table */}
      <div className="bg-card rounded-xl card-shadow border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Month", "Room", "Tenant", "Rent", "Water", "Electric", "Total", "Due Date", "Status", ""].map(h => (
                  <th key={h} className={`px-4 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wide ${
                    ["Rent", "Water", "Electric", "Total"].includes(h) ? "text-right" : "text-left"
                  }`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(bill => {
                const room = mockRooms.find(r => r.id === bill.roomId);
                const tenant = mockTenants.find(t => t.id === bill.tenantId);
                const cfg = statusConfig[bill.status];

                return (
                  <tr key={bill.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-foreground whitespace-nowrap">{bill.month}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">Room {room?.roomNumber}</td>
                    <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap max-w-[140px] truncate">{tenant?.name}</td>
                    <td className="px-4 py-3.5 text-right">฿{bill.rentAmount.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right">฿{bill.waterAmount}</td>
                    <td className="px-4 py-3.5 text-right">฿{bill.electricAmount}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-foreground">฿{bill.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                      {bill.dueDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.class}`}>
                        <cfg.icon size={10} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button className="text-xs text-teal hover:underline font-medium">View</button>
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

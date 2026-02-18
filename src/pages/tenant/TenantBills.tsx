import { Receipt, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { mockBills } from "@/data/mockData";

const myBills = mockBills.filter(b => b.tenantId === "t1");

const statusConfig = {
  paid: { label: "Paid", icon: CheckCircle, cls: "status-paid" },
  unpaid: { label: "Unpaid", icon: AlertCircle, cls: "status-unpaid" },
  overdue: { label: "Overdue", icon: Clock, cls: "status-overdue" },
  pending: { label: "Pending", icon: Clock, cls: "status-pending" },
};

export default function TenantBills() {
  return (
    <div className="space-y-5 max-w-3xl">
      <p className="text-muted-foreground text-sm">Your billing history</p>
      <div className="bg-card rounded-xl card-shadow border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Month", "Rent", "Water", "Electric", "Total", "Due Date", "Status", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myBills.map(bill => {
                const cfg = statusConfig[bill.status];
                return (
                  <tr key={bill.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-foreground">{bill.month}</td>
                    <td className="px-5 py-4">฿{bill.rentAmount.toLocaleString()}</td>
                    <td className="px-5 py-4">฿{bill.waterAmount}</td>
                    <td className="px-5 py-4">฿{bill.electricAmount}</td>
                    <td className="px-5 py-4 font-bold text-foreground">฿{bill.totalAmount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-muted-foreground">{bill.dueDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
                        <cfg.icon size={10} /> {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {bill.status !== "paid" && (
                        <a href="/tenant/payment" className="text-xs text-teal font-medium hover:underline">Pay</a>
                      )}
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

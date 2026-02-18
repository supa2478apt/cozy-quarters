import { FileText, Calendar, Home, CheckCircle, Clock, AlertCircle } from "lucide-react";


// Add mock contracts to data
const contracts = [
  {
    id: "c1", dormId: "dorm1", roomId: "r1", tenantId: "t1",
    startDate: new Date("2023-03-01"), endDate: new Date("2024-03-01"),
    monthlyRent: 5500, deposit: 11000, status: "active" as const,
    terms: "Standard 1-year lease agreement. No pets allowed. Quiet hours 10pm–8am.",
    createdAt: new Date("2023-03-01"),
  },
  {
    id: "c2", dormId: "dorm1", roomId: "r3", tenantId: "t2",
    startDate: new Date("2023-05-15"), endDate: new Date("2024-05-15"),
    monthlyRent: 6000, deposit: 12000, status: "active" as const,
    terms: "Standard 1-year lease agreement. Utilities metered separately.",
    createdAt: new Date("2023-05-15"),
  },
  {
    id: "c3", dormId: "dorm1", roomId: "r9", tenantId: "t5",
    startDate: new Date("2024-03-01"), endDate: new Date("2025-03-01"),
    monthlyRent: 6200, deposit: 12400, status: "active" as const,
    terms: "Standard 1-year lease. Parking included.",
    createdAt: new Date("2024-03-01"),
  },
];

const statusConfig = {
  active: { label: "Active", icon: CheckCircle, cls: "status-paid" },
  expired: { label: "Expired", icon: Clock, cls: "bg-muted text-muted-foreground border border-border" },
  terminated: { label: "Terminated", icon: AlertCircle, cls: "status-overdue" },
};

export default function Contracts() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">Digital rental contracts</p>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal hover:bg-teal-dark text-white text-sm font-medium transition-colors">
          <FileText size={15} />
          New Contract
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {contracts.map(c => {
          const cfg = statusConfig[c.status];
          const daysLeft = Math.ceil((c.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          return (
            <div key={c.id} className="bg-card rounded-xl border border-border card-shadow hover:shadow-lg transition-all duration-200">
              <div className="p-5 border-b border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-light border border-teal/20 flex items-center justify-center">
                      <FileText size={16} className="text-teal" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Contract #{c.id.toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">Room {c.roomId.replace("r", "")}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cfg.cls}`}>
                    {cfg.label}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Calendar size={12} /> Start</span>
                    <span className="font-medium text-foreground">{c.startDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Calendar size={12} /> End</span>
                    <span className="font-medium text-foreground">{c.endDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Home size={12} /> Monthly Rent</span>
                    <span className="font-semibold text-teal">฿{c.monthlyRent.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Deposit</span>
                    <span className="font-medium">฿{c.deposit.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{c.terms}</p>
                {daysLeft > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Days remaining</span>
                    <span className={`font-semibold ${daysLeft < 30 ? "text-rose" : "text-teal"}`}>
                      {daysLeft} days
                    </span>
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:border-teal/40 hover:text-teal transition-colors">
                    View PDF
                  </button>
                  <button className="flex-1 py-1.5 rounded-lg bg-muted text-xs font-medium text-foreground hover:bg-muted/80 transition-colors">
                    Renew
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

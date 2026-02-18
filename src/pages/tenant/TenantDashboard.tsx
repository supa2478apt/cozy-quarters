import { Receipt, CheckCircle, AlertCircle, Clock, QrCode, FileText, Droplets, Zap } from "lucide-react";
import { mockBills, mockRooms, mockMeters } from "@/data/mockData";
import { QRCodeSVG } from "qrcode.react";

// Demo: tenant sees room r1
const myBill = mockBills.find(b => b.tenantId === "t1" && b.month === "2025-02")!;
const myRoom = mockRooms.find(r => r.id === "r1")!;
const myMeter = mockMeters.find(m => m.roomId === "r1")!;

const statusConfig = {
  paid: { label: "Paid", icon: CheckCircle, cls: "status-paid" },
  unpaid: { label: "Unpaid", icon: AlertCircle, cls: "status-unpaid" },
  overdue: { label: "Overdue", icon: Clock, cls: "status-overdue" },
  pending: { label: "Pending", icon: Clock, cls: "status-pending" },
};

export default function TenantDashboard() {
  const cfg = statusConfig[myBill?.status ?? "unpaid"];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Welcome */}
      <div className="bg-sidebar sidebar-gradient rounded-xl p-6 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-teal/10" />
        <p className="text-sidebar-foreground/70 text-sm mb-1">Welcome back,</p>
        <h2 className="text-white text-2xl font-bold mb-3">Somchai Jaidee</h2>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-sidebar-foreground/60 text-xs">Room</p>
            <p className="text-white font-semibold">#{myRoom.roomNumber}</p>
          </div>
          <div>
            <p className="text-sidebar-foreground/60 text-xs">Monthly Rent</p>
            <p className="text-white font-semibold">฿{myRoom.monthlyRent.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sidebar-foreground/60 text-xs">Building</p>
            <p className="text-white font-semibold">The Grand Residence</p>
          </div>
        </div>
      </div>

      {/* Current bill */}
      {myBill && (
        <div className="bg-card rounded-xl card-shadow border border-border p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Receipt size={18} className="text-teal" />
              <h3 className="font-semibold text-foreground">Current Bill — {myBill.month}</h3>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${cfg.cls}`}>
              <cfg.icon size={11} /> {cfg.label}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: "Rent", value: myBill.rentAmount, icon: null },
              { label: "Water", value: myBill.waterAmount, icon: Droplets },
              { label: "Electric", value: myBill.electricAmount, icon: Zap },
              { label: "Total", value: myBill.totalAmount, icon: null, highlight: true },
            ].map(({ label, value, icon: Icon, highlight }) => (
              <div key={label} className={`rounded-xl p-3 ${highlight ? "bg-teal text-white" : "bg-muted/50"}`}>
                <div className="flex items-center gap-1 mb-1">
                  {Icon && <Icon size={11} className={highlight ? "text-white/80" : "text-muted-foreground"} />}
                  <p className={`text-xs font-medium ${highlight ? "text-white/80" : "text-muted-foreground"}`}>{label}</p>
                </div>
                <p className={`font-bold text-lg ${highlight ? "text-white" : "text-foreground"}`}>฿{value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
            <span className="text-muted-foreground">Due: {myBill.dueDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            <a href="/tenant/payment" className="text-teal font-medium hover:underline flex items-center gap-1">
              <QrCode size={14} /> Pay Now
            </a>
          </div>
        </div>
      )}

      {/* Meter readings */}
      {myMeter && (
        <div className="bg-card rounded-xl card-shadow border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Utility Readings — {myMeter.month}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-medium text-sm"><Droplets size={15} /> Water</div>
              <div className="flex gap-2 text-sm">
                <div className="flex-1 bg-blue-50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-muted-foreground mb-0.5">Previous</p>
                  <p className="font-bold text-foreground font-mono">{myMeter.waterPrev}</p>
                </div>
                <div className="flex-1 bg-blue-100 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-muted-foreground mb-0.5">Current</p>
                  <p className="font-bold text-blue-700 font-mono">{myMeter.waterCurrent}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Usage: {myMeter.waterUsage} units × ฿{myMeter.waterRate} = <strong>฿{myMeter.waterUsage * myMeter.waterRate}</strong></p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-600 font-medium text-sm"><Zap size={15} /> Electricity</div>
              <div className="flex gap-2 text-sm">
                <div className="flex-1 bg-amber-50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-muted-foreground mb-0.5">Previous</p>
                  <p className="font-bold text-foreground font-mono">{myMeter.electricPrev}</p>
                </div>
                <div className="flex-1 bg-amber-100 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-muted-foreground mb-0.5">Current</p>
                  <p className="font-bold text-amber-700 font-mono">{myMeter.electricCurrent}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Usage: {myMeter.electricUsage} units × ฿{myMeter.electricRate} = <strong>฿{myMeter.electricUsage * myMeter.electricRate}</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

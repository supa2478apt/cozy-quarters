import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ================= TYPES ================= */

type BillStatus = "paid" | "unpaid" | "pending" | "overdue";

type Bill = {
  id: string;
  apartmentId: string;
  roomId: string;
  roomNumber: string;
  tenantId: string;
  tenantName: string;
  month: string;
  rentAmount: number;
  waterPrice: number;
  electricPrice: number;
  otherFee: number;
  totalAmount: number;
  dueDate: any;
  status: BillStatus;
  createdAt: any;
};

/* ================= STATUS CONFIG ================= */

const statusConfig: Record<
  BillStatus,
  { label: string; icon: any; class: string }
> = {
  paid: {
    label: "Paid",
    icon: CheckCircle2,
    class: "status-paid",
  },
  unpaid: {
    label: "Unpaid",
    icon: AlertCircle,
    class: "status-unpaid",
  },
  overdue: {
    label: "Overdue",
    icon: Clock,
    class: "status-overdue",
  },
  pending: {
    label: "Pending",
    icon: Zap,
    class: "status-pending",
  },
};

/* ================= COMPONENT ================= */

export default function Bills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [statusFilter, setStatusFilter] =
    useState<BillStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  /* ---------------- LOAD FIREBASE ---------------- */

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "bills"), (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Bill),
      }));
      setBills(data);
    });

    return () => unsub();
  }, []);

  /* ---------------- AUTO OVERDUE ---------------- */

  const processedBills = useMemo(() => {
    return bills.map((b) => {
      if (
        b.status === "unpaid" &&
        b.dueDate &&
        new Date(
          b.dueDate.seconds
            ? b.dueDate.seconds * 1000
            : b.dueDate
        ) < new Date()
      ) {
        return { ...b, status: "overdue" as BillStatus };
      }

      return b;
    });
  }, [bills]);

  /* ---------------- FILTER ---------------- */

  const filtered =
    statusFilter === "all"
      ? processedBills
      : processedBills.filter(
        (b) => b.status === statusFilter
      );

  /* ---------------- TOTALS ---------------- */

  const totals = {
    all: processedBills.length,
    paid: processedBills.filter((b) => b.status === "paid")
      .length,
    unpaid: processedBills.filter((b) => b.status === "unpaid")
      .length,
    overdue: processedBills.filter((b) => b.status === "overdue")
      .length,
    pending: processedBills.filter((b) => b.status === "pending")
      .length,
  };

  const totalCollected = processedBills
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalUnpaid = processedBills
    .filter((b) => b.status !== "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  /* ================= UI ================= */

  return (
    <div className="space-y-5">
      {/* ================= SUMMARY CARDS ================= */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Collected"
          value={`฿${totalCollected.toLocaleString()}`}
          subtitle={`${totals.paid} bills paid`}
          color="text-emerald-600"
        />

        <SummaryCard
          title="Outstanding"
          value={`฿${totalUnpaid.toLocaleString()}`}
          subtitle={`${totals.unpaid + totals.overdue
            } bills pending`}
          color="text-red-500"
        />

        <SummaryCard
          title="Overdue"
          value={totals.overdue}
          subtitle="Requires attention"
          color="text-orange-500"
        />

        <SummaryCard
          title="Awaiting"
          value={totals.pending}
          subtitle="Slip uploaded"
          color="text-amber-500"
        />
      </div>

      {/* ================= FILTER ================= */}

      <div className="flex gap-2 flex-wrap">
        {(
          ["all", "paid", "unpaid", "overdue", "pending"] as const
        ).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${statusFilter === s
                ? "bg-teal text-white border-teal"
                : "bg-card text-muted-foreground border-border hover:border-teal/40 hover:text-teal"
              }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)} (
            {totals[s]})
          </button>
        ))}
      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-card rounded-xl card-shadow border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[
                  "Month",
                  "Room",
                  "Tenant",
                  "Rent",
                  "Water",
                  "Electric",
                  "Total",
                  "Due Date",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className={`px-4 py-3.5 text-xs uppercase tracking-wide font-medium text-muted-foreground ${["Rent", "Water", "Electric", "Total"].includes(
                      h
                    )
                        ? "text-right"
                        : "text-left"
                      }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((bill) => {
                const cfg = statusConfig[bill.status];

                const due = bill.dueDate?.seconds
                  ? new Date(bill.dueDate.seconds * 1000)
                  : new Date(bill.dueDate);

                return (
                  <tr
                    key={bill.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-medium whitespace-nowrap">
                      {bill.month}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      Room {bill.roomNumber}
                    </td>

                    <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap max-w-[140px] truncate">
                      {bill.tenantName}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      ฿{bill.rentAmount.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      ฿{bill.waterPrice.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      ฿{bill.electricPrice.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 text-right font-semibold">
                      ฿{bill.totalAmount.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">
                      {due.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.class}`}
                      >
                        <cfg.icon size={10} />
                        {cfg.label}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <button
                        className="text-xs text-teal hover:underline font-medium"
                        onClick={() => navigate(`${bill.id}`)}
                      >
                        View
                      </button>
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

/* ================= REUSABLE CARD ================= */

function SummaryCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border card-shadow">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        {title}
      </p>
      <p className={`text-xl font-bold mt-1 ${color}`}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {subtitle}
      </p>
    </div>
  );
}
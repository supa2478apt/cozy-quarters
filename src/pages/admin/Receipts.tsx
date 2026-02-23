import { useEffect, useMemo, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Payment = {
  id: string;
  billId: string;
  amount: number;
  paidAt?: any;
  slipUrl?: string;
  status?: "pending" | "approved" | "rejected";
  verifiedAt?: any;
};

type Bill = {
  roomNumber?: string;
  tenantName?: string;
  totalAmount?: number;
  month?: string;
};

export default function Receipts() {
  const navigate = useNavigate();
  const [billsMap, setBillsMap] = useState<Record<string, any>>({});
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selected, setSelected] = useState<Payment | null>(null);
  const [billDetail, setBillDetail] = useState<Bill | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingBill, setLoadingBill] = useState(false);

  // 🔥 Realtime newest first
  useEffect(() => {
    const q = query(
      collection(db, "payments"),
      orderBy("paidAt", "desc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const paymentData: Payment[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Payment, "id">),
      }));

      setPayments(paymentData);

      // 🔥 โหลด bills ทั้งหมดที่เกี่ยวข้อง
      const billIds = [
        ...new Set(paymentData.map((p) => p.billId)),
      ];

      const billPromises = billIds.map((id) =>
        getDoc(doc(db, "bills", id))
      );

      const billSnaps = await Promise.all(billPromises);

      const billMap: Record<string, any> = {};

      billSnaps.forEach((snap, index) => {
        if (snap.exists()) {
          billMap[billIds[index]] = snap.data();
        }
      });

      setBillsMap(billMap);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🔥 โหลด bill ตอนกดตรวจสอบ
  const openVerifyDialog = async (payment: Payment) => {
    setSelected(payment);
    setLoadingBill(true);

    const snap = await getDoc(doc(db, "bills", payment.billId));
    if (snap.exists()) {
      setBillDetail(snap.data() as Bill);
    }

    setLoadingBill(false);
    setOpen(true);
  };

  const approvePayment = async (payment: Payment) => {
    await updateDoc(doc(db, "payments", payment.id), {
      status: "approved",
      verifiedAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "bills", payment.billId), {
      status: "paid",
      paidAt: serverTimestamp(),
    });

    setOpen(false);
  };

  const rejectPayment = async (payment: Payment) => {
    await updateDoc(doc(db, "payments", payment.id), {
      status: "rejected",
      verifiedAt: serverTimestamp(),
    });

    setOpen(false);
  };

  const pendingCount = useMemo(
    () => payments.filter((p) => p.status === "pending").length,
    [payments]
  );

  const approvedCount = useMemo(
    () => payments.filter((p) => p.status === "approved").length,
    [payments]
  );

  const totalRevenue = useMemo(
    () =>
      payments
        .filter((p) => p.status === "approved")
        .reduce((sum, p) => sum + (p.amount || 0), 0),
    [payments]
  );

  if (loading) return <div className="p-6">กำลังโหลด...</div>;

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          จัดการใบเสร็จและการชำระเงิน
        </h1>
        <p className="text-muted-foreground text-sm">
          ตรวจสอบการโอนเงินและอนุมัติรายการ
        </p>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-3 text-left">ชื่อผู้ชำระ</th>
                <th className="p-3 text-left">ห้อง</th>
                <th className="p-3 text-left">ยอด</th>
                <th className="p-3 text-left">วันที่ชำระ</th>
                <th className="p-3 text-left">สถานะ</th>
                <th className="p-3 text-right">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-muted/40 cursor-pointer"
                  onClick={() => navigate(`/bills/${p.billId}`)}
                >
<td className="p-3">
  {billsMap[p.billId]?.tenantName || "-"}
</td>

<td className="p-3">
  {billsMap[p.billId]?.roomNumber || "-"}
</td>

                  <td className="p-3 font-semibold">
                    ฿{(p.amount || 0).toLocaleString()}
                  </td>

                  <td className="p-3 text-muted-foreground">
                    {p.paidAt?.toDate
                      ? p.paidAt.toDate().toLocaleString("th-TH")
                      : "-"}
                  </td>

                  <td className="p-3">
                    {p.status === "approved" && (
                      <Badge className="bg-emerald-500 text-white">
                        อนุมัติแล้ว
                      </Badge>
                    )}
                    {p.status === "pending" && (
                      <Badge
                        variant="outline"
                        className="text-amber-600 border-amber-500"
                      >
                        รอตรวจสอบ
                      </Badge>
                    )}
                    {p.status === "rejected" && (
                      <Badge variant="destructive">
                        ปฏิเสธ
                      </Badge>
                    )}
                  </td>

                  <td
                    className="p-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {p.status === "pending" ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openVerifyDialog(p)}
                      >
                        ตรวจสอบ
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/admin/receipts/${p.billId}`)}
                      >
                        ดูใบเสร็จ
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              รอตรวจสอบ
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {pendingCount} รายการ
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              อนุมัติแล้ว
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {approvedCount} รายการ
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              รายได้รวม
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ฿{totalRevenue.toLocaleString()}
          </CardContent>
        </Card>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>ตรวจสอบการชำระเงิน</DialogTitle>
          </DialogHeader>

          {loadingBill && <div>กำลังโหลดข้อมูล...</div>}

          {selected && billDetail && (
            <div className="grid md:grid-cols-2 gap-6 text-sm">

              {/* ซ้าย */}
              <div className="bg-muted/40 p-6 rounded-lg space-y-3">
                <div>รหัสรายการ: {selected.id}</div>
                <div>ห้อง: {billDetail.roomNumber}</div>
                <div>ผู้เช่า: {billDetail.tenantName}</div>
                <div className="text-blue-600 font-semibold">
                  ยอดเงิน: ฿{billDetail.totalAmount?.toLocaleString()}
                </div>
                <div>
                  วันที่ชำระ:{" "}
                  {selected.paidAt?.toDate
                    ? selected.paidAt.toDate().toLocaleString("th-TH")
                    : "-"}
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => approvePayment(selected)}
                  >
                    อนุมัติ
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => rejectPayment(selected)}
                  >
                    ปฏิเสธ
                  </Button>
                </div>
              </div>

              {/* ขวา */}
              <div className="border rounded-lg flex items-center justify-center bg-muted/20">
                {selected.slipUrl ? (
                  <img
                    src={selected.slipUrl}
                    alt="Payment Slip"
                    className="max-h-[500px] object-contain"
                  />
                ) : (
                  <div className="text-muted-foreground">
                    ไม่มีสลิปแนบมา
                  </div>
                )}
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
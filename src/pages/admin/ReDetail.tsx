import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Apartment = {
  name?: string;
  address?: string;
};

type Bill = {
  id: string;
  apartmentId?: string;
  tenantName?: string;
  roomNumber?: string;
  month?: string;
  rentAmount?: number;
  waterPrice?: number;
  electricPrice?: number;
  otherFee?: number;
  totalAmount?: number;
  createdAt?: any;
  dueDate?: any;
};

export default function BillDetail() {
  const { id } = useParams();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [apartment, setApartment] = useState<Apartment | null>(null);

  

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      // 1️⃣ ดึง bill
      const billRef = doc(db, "bills", id);
      const billSnap = await getDoc(billRef);

      if (!billSnap.exists()) {
        setLoading(false);
        return;
      }

      const billData: Bill = {
        id: billSnap.id,
        ...(billSnap.data() as Omit<Bill, "id">),
      };
      setBill(billData);

      // 2️⃣ ถ้ามี apartmentId → ดึง apartments
      if (billData.apartmentId) {
        const aptRef = doc(db, "apartments", billData.apartmentId);
        const aptSnap = await getDoc(aptRef);

        if (aptSnap.exists()) {
          setApartment(aptSnap.data());
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!bill) {
    return <div className="p-6">Bill not found</div>;
  }

  const createdDate = bill.createdAt?.seconds
    ? new Date(bill.createdAt.seconds * 1000)
    : null;

  const dueDate = bill.dueDate?.seconds
    ? new Date(bill.dueDate.seconds * 1000)
    : bill.dueDate
      ? new Date(bill.dueDate)
      : null;

  const subtotal =
    (bill.rentAmount || 0) +
    (bill.waterPrice || 0) +
    (bill.electricPrice || 0) +
    (bill.otherFee || 0);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-blue-600">
            ใบเสร็จรับเงิน / RECEIPT
          </h1>
          <p className="text-sm text-muted-foreground">
            เลขที่: {bill.id}
          </p>
        </div>
        <div className="text-right text-sm space-y-1">
          <p className="font-medium">
            {apartment?.name || "-"}
          </p>
          <p className="text-muted-foreground">
            {apartment?.address || "-"}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-8 text-sm">

        <div className="space-y-2">
          <div>
            <p className="text-muted-foreground">ส่งถึง (Tenant):</p>
            <p className="font-medium">{bill.tenantName}</p>
          </div>

          <div>
            <p className="text-muted-foreground">เลขที่ห้อง</p>
            <p className="font-medium">{bill.roomNumber}</p>
          </div>
        </div>

        <div className="space-y-2 text-right">
          <div>
            <p className="text-muted-foreground">วันที่จ่าย</p>
            <p className="font-medium">
              {createdDate?.toLocaleDateString("th-TH")}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">วันที่ครบกำหนดจ่าย</p>
            <p className="font-medium text-red-600">
              {dueDate?.toLocaleDateString("th-TH")}
            </p>
          </div>
        </div>

      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left">
                รายการ (Description)
              </th>
              <th className="px-4 py-3 text-right">
                จำนวนเงิน (Amount)
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="px-4 py-3">
                ค่าเช่าห้องประจำเดือน {bill.month}
              </td>
              <td className="px-4 py-3 text-right">
                ฿{bill.rentAmount?.toLocaleString()}
              </td>
            </tr>

            <tr className="border-t">
              <td className="px-4 py-3">ค่าไฟฟ้า</td>
              <td className="px-4 py-3 text-right">
                ฿{bill.electricPrice?.toLocaleString()}
              </td>
            </tr>

            <tr className="border-t">
              <td className="px-4 py-3">ค่าน้ำประปา</td>
              <td className="px-4 py-3 text-right">
                ฿{bill.waterPrice?.toLocaleString()}
              </td>
            </tr>

            <tr className="border-t">
              <td className="px-4 py-3">ค่าใช้จ่ายอื่นๆ</td>
              <td className="px-4 py-3 text-right">
                ฿{bill.otherFee?.toLocaleString() || 0}
              </td>
            </tr>

            {/* Subtotal */}
            <tr className="border-t">
              <td colSpan={2} className="px-4 py-3">
                <div className="flex justify-end gap-8">
                  <span className="font-medium">
                    รวมเงินสุทธิ (Subtotal)
                  </span>
                  <span>
                    ฿{subtotal.toLocaleString()}
                  </span>
                </div>
              </td>
            </tr>

            {/* Total */}
            <tr className="border-t bg-muted/30">
              <td colSpan={2} className="px-4 py-3">
                <div className="flex justify-end gap-8">
                  <span className="font-semibold text-lg">
                    ยอดรับชำระ (Total)
                  </span>
                  <span className="font-bold text-lg text-blue-600">
                    ฿{bill.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
}
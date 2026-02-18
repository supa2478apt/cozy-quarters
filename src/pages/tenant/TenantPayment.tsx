import { useState } from "react";
import { Upload, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { mockBills } from "@/data/mockData";

const myBill = mockBills.find(b => b.tenantId === "t1" && b.month === "2025-02")!;
const PROMPTPAY_ID = "0812345678"; // Replace with real PromptPay ID

export default function TenantPayment() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="max-w-lg space-y-5">
      <p className="text-muted-foreground text-sm">Scan QR code and upload your payment slip</p>

      <div className="bg-card rounded-xl card-shadow border border-border p-6 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Amount Due</p>
        <p className="text-4xl font-bold text-teal mb-1">฿{myBill?.totalAmount.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mb-6">February 2025 — Room 101</p>

        <div className="flex justify-center mb-4">
          <div className="p-4 bg-white rounded-2xl border-2 border-border shadow-sm">
            <QRCodeSVG value={`promptpay:${PROMPTPAY_ID}:${myBill?.totalAmount}`} size={200} level="M" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">PromptPay: {PROMPTPAY_ID}</p>
        <p className="text-xs text-muted-foreground mt-1">Amount is NOT fixed — enter manually in your banking app</p>
      </div>

      <div className="bg-card rounded-xl card-shadow border border-border p-5">
        <h3 className="font-semibold text-foreground mb-3">Upload Payment Slip</h3>
        {!uploaded ? (
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-teal/50 hover:bg-teal-light/20 transition-all">
            <Upload size={28} className="text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Click to upload slip</p>
              <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG up to 10MB • Auto-deleted after 3 days</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={() => setUploaded(true)} />
          </label>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <CheckCircle2 size={20} className="text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-700">Slip uploaded successfully!</p>
              <p className="text-xs text-emerald-600">Admin will verify and confirm your payment shortly.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

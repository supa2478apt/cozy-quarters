// Firestore data types
export type UserRole = "admin" | "tenant";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  dormId?: string; // for tenants
  phone?: string;
  createdAt: Date;
}

export interface Dorm {
  id: string;
  name: string;
  address: string;
  totalFloors: number;
  totalRooms: number;
  adminUid: string;
  createdAt: Date;
}

export type RoomStatus = "vacant" | "occupied" | "maintenance" | "reserved";

export interface Room {
  id: string;
  dormId: string;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  monthlyRent: number;
  tenantId?: string;
  contractId?: string;
  description?: string;
  createdAt: Date;
}

export interface Tenant {
  id: string;
  dormId: string;
  roomId: string;
  userId: string;
  name: string;
  phone: string;
  idCard: string;
  email: string;
  moveInDate: Date;
  moveOutDate?: Date;
  emergencyContact?: string;
  notes?: string;
  createdAt: Date;
}

export interface Contract {
  id: string;
  dormId: string;
  roomId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  deposit: number;
  terms: string;
  status: "active" | "expired" | "terminated";
  createdAt: Date;
}

export interface MeterReading {
  id: string;
  dormId: string;
  roomId: string;
  month: string; // "YYYY-MM"
  waterPrev: number;
  waterCurrent: number;
  waterUsage: number;
  waterRate: number;
  electricPrev: number;
  electricCurrent: number;
  electricUsage: number;
  electricRate: number;
  recordedAt: Date;
  recordedBy: string;
}

export type BillStatus = "unpaid" | "paid" | "overdue" | "pending";

export interface Bill {
  id: string;
  dormId: string;
  roomId: string;
  tenantId: string;
  month: string; // "YYYY-MM"
  rentAmount: number;
  waterAmount: number;
  electricAmount: number;
  otherAmount: number;
  totalAmount: number;
  dueDate: Date;
  status: BillStatus;
  paidAt?: Date;
  slipUrl?: string;
  notes?: string;
  createdAt: Date;
}

export interface Receipt {
  id: string;
  dormId: string;
  billId: string;
  tenantId: string;
  amount: number;
  paymentMethod: "qr" | "cash" | "transfer";
  slipUrl?: string;
  confirmedBy?: string;
  createdAt: Date;
}

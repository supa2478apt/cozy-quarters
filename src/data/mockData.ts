// Mock data for demo mode (when Firebase is not yet configured)
import { Dorm, Room, Tenant, Bill, MeterReading } from "@/types";

export const mockDorms: Dorm[] = [
  {
    id: "dorm1",
    name: "The Grand Residence",
    address: "123 Sukhumvit Rd, Bangkok 10110",
    totalFloors: 5,
    totalRooms: 40,
    adminUid: "admin1",
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "dorm2",
    name: "Lakeview Apartments",
    address: "456 Rama 9 Rd, Bangkok 10310",
    totalFloors: 8,
    totalRooms: 64,
    adminUid: "admin1",
    createdAt: new Date("2023-06-01"),
  },
];

export const mockRooms: Room[] = [
  { id: "r1", dormId: "dorm1", roomNumber: "101", floor: 1, status: "occupied", monthlyRent: 5500, tenantId: "t1", createdAt: new Date() },
  { id: "r2", dormId: "dorm1", roomNumber: "102", floor: 1, status: "vacant", monthlyRent: 5500, createdAt: new Date() },
  { id: "r3", dormId: "dorm1", roomNumber: "103", floor: 1, status: "occupied", monthlyRent: 6000, tenantId: "t2", createdAt: new Date() },
  { id: "r4", dormId: "dorm1", roomNumber: "104", floor: 1, status: "maintenance", monthlyRent: 5500, createdAt: new Date() },
  { id: "r5", dormId: "dorm1", roomNumber: "201", floor: 2, status: "occupied", monthlyRent: 5800, tenantId: "t3", createdAt: new Date() },
  { id: "r6", dormId: "dorm1", roomNumber: "202", floor: 2, status: "reserved", monthlyRent: 5800, createdAt: new Date() },
  { id: "r7", dormId: "dorm1", roomNumber: "203", floor: 2, status: "occupied", monthlyRent: 5800, tenantId: "t4", createdAt: new Date() },
  { id: "r8", dormId: "dorm1", roomNumber: "204", floor: 2, status: "vacant", monthlyRent: 5800, createdAt: new Date() },
  { id: "r9", dormId: "dorm1", roomNumber: "301", floor: 3, status: "occupied", monthlyRent: 6200, tenantId: "t5", createdAt: new Date() },
  { id: "r10", dormId: "dorm1", roomNumber: "302", floor: 3, status: "occupied", monthlyRent: 6200, tenantId: "t6", createdAt: new Date() },
  { id: "r11", dormId: "dorm1", roomNumber: "303", floor: 3, status: "vacant", monthlyRent: 6200, createdAt: new Date() },
  { id: "r12", dormId: "dorm1", roomNumber: "304", floor: 3, status: "occupied", monthlyRent: 6500, tenantId: "t7", createdAt: new Date() },
];

export const mockTenants: Tenant[] = [
  { id: "t1", dormId: "dorm1", roomId: "r1", userId: "u1", name: "Somchai Jaidee", phone: "081-234-5678", idCard: "1234567890123", email: "somchai@email.com", moveInDate: new Date("2023-03-01"), createdAt: new Date() },
  { id: "t2", dormId: "dorm1", roomId: "r3", userId: "u2", name: "Nattaya Srirak", phone: "082-345-6789", idCard: "2345678901234", email: "nattaya@email.com", moveInDate: new Date("2023-05-15"), createdAt: new Date() },
  { id: "t3", dormId: "dorm1", roomId: "r5", userId: "u3", name: "Peerawat Khamthai", phone: "083-456-7890", idCard: "3456789012345", email: "peerawat@email.com", moveInDate: new Date("2023-08-01"), createdAt: new Date() },
  { id: "t4", dormId: "dorm1", roomId: "r7", userId: "u4", name: "Malee Wongsri", phone: "084-567-8901", idCard: "4567890123456", email: "malee@email.com", moveInDate: new Date("2024-01-01"), createdAt: new Date() },
  { id: "t5", dormId: "dorm1", roomId: "r9", userId: "u5", name: "Tanakrit Phrom", phone: "085-678-9012", idCard: "5678901234567", email: "tanakrit@email.com", moveInDate: new Date("2024-03-01"), createdAt: new Date() },
  { id: "t6", dormId: "dorm1", roomId: "r10", userId: "u6", name: "Siriwan Chai", phone: "086-789-0123", idCard: "6789012345678", email: "siriwan@email.com", moveInDate: new Date("2024-06-01"), createdAt: new Date() },
  { id: "t7", dormId: "dorm1", roomId: "r12", userId: "u7", name: "Wanchai Burana", phone: "087-890-1234", idCard: "7890123456789", email: "wanchai@email.com", moveInDate: new Date("2024-09-01"), createdAt: new Date() },
];

export const mockBills: Bill[] = [
  { id: "b1", dormId: "dorm1", roomId: "r1", tenantId: "t1", month: "2025-01", rentAmount: 5500, waterAmount: 180, electricAmount: 620, otherAmount: 0, totalAmount: 6300, dueDate: new Date("2025-02-05"), status: "paid", paidAt: new Date("2025-02-03"), createdAt: new Date() },
  { id: "b2", dormId: "dorm1", roomId: "r3", tenantId: "t2", month: "2025-01", rentAmount: 6000, waterAmount: 210, electricAmount: 740, otherAmount: 0, totalAmount: 6950, dueDate: new Date("2025-02-05"), status: "paid", paidAt: new Date("2025-02-01"), createdAt: new Date() },
  { id: "b3", dormId: "dorm1", roomId: "r5", tenantId: "t3", month: "2025-01", rentAmount: 5800, waterAmount: 160, electricAmount: 580, otherAmount: 0, totalAmount: 6540, dueDate: new Date("2025-02-05"), status: "overdue", createdAt: new Date() },
  { id: "b4", dormId: "dorm1", roomId: "r7", tenantId: "t4", month: "2025-01", rentAmount: 5800, waterAmount: 195, electricAmount: 660, otherAmount: 0, totalAmount: 6655, dueDate: new Date("2025-02-05"), status: "unpaid", createdAt: new Date() },
  { id: "b5", dormId: "dorm1", roomId: "r9", tenantId: "t5", month: "2025-01", rentAmount: 6200, waterAmount: 220, electricAmount: 800, otherAmount: 0, totalAmount: 7220, dueDate: new Date("2025-02-05"), status: "pending", createdAt: new Date() },
  { id: "b6", dormId: "dorm1", roomId: "r10", tenantId: "t6", month: "2025-01", rentAmount: 6200, waterAmount: 170, electricAmount: 590, otherAmount: 0, totalAmount: 6960, dueDate: new Date("2025-02-05"), status: "paid", paidAt: new Date("2025-02-04"), createdAt: new Date() },
  { id: "b7", dormId: "dorm1", roomId: "r12", tenantId: "t7", month: "2025-01", rentAmount: 6500, waterAmount: 240, electricAmount: 870, otherAmount: 0, totalAmount: 7610, dueDate: new Date("2025-02-05"), status: "unpaid", createdAt: new Date() },
  // Feb 2025
  { id: "b8", dormId: "dorm1", roomId: "r1", tenantId: "t1", month: "2025-02", rentAmount: 5500, waterAmount: 190, electricAmount: 640, otherAmount: 0, totalAmount: 6330, dueDate: new Date("2025-03-05"), status: "unpaid", createdAt: new Date() },
];

export const mockMeters: MeterReading[] = [
  { id: "m1", dormId: "dorm1", roomId: "r1", month: "2025-01", waterPrev: 120, waterCurrent: 138, waterUsage: 18, waterRate: 10, electricPrev: 4500, electricCurrent: 4562, electricUsage: 62, electricRate: 10, recordedAt: new Date("2025-01-28"), recordedBy: "admin1" },
  { id: "m2", dormId: "dorm1", roomId: "r3", month: "2025-01", waterPrev: 85, waterCurrent: 106, waterUsage: 21, waterRate: 10, electricPrev: 3200, electricCurrent: 3274, electricUsage: 74, electricRate: 10, recordedAt: new Date("2025-01-28"), recordedBy: "admin1" },
  { id: "m3", dormId: "dorm1", roomId: "r5", month: "2025-01", waterPrev: 60, waterCurrent: 76, waterUsage: 16, waterRate: 10, electricPrev: 2800, electricCurrent: 2858, electricUsage: 58, electricRate: 10, recordedAt: new Date("2025-01-28"), recordedBy: "admin1" },
];

export const monthlyRevenue = [
  { month: "Aug", revenue: 38400, target: 42000 },
  { month: "Sep", revenue: 41200, target: 42000 },
  { month: "Oct", revenue: 39800, target: 42000 },
  { month: "Nov", revenue: 43500, target: 42000 },
  { month: "Dec", revenue: 45200, target: 42000 },
  { month: "Jan", revenue: 42500, target: 42000 },
];

export const occupancyData = [
  { name: "Occupied", value: 7, color: "#0d9488" },
  { name: "Vacant", value: 3, color: "#e2e8f0" },
  { name: "Maintenance", value: 1, color: "#f59e0b" },
  { name: "Reserved", value: 1, color: "#8b5cf6" },
];

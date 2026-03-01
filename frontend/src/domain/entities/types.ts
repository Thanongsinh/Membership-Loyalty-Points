export type Role = "ADMIN" | "STAFF" | "MEMBER";
export type Tier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
export type TransactionType = "EARN" | "REDEEM" | "ADJUST" | "EXPIRE";

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Member {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  tier: Tier;
  totalPoints: number;
  currentPoints: number;
  createdAt: string;
  updatedAt: string;
  user?: { email: string; role: Role };
}

export interface Reward {
  id: string;
  name: string;
  description: string | null;
  pointsCost: number;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  memberId: string;
  type: TransactionType;
  points: number;
  description: string | null;
  createdAt: string;
  member?: { firstName: string; lastName: string };
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Store System
export interface Store {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  openingHours: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: { staff: number; products: number; orders: number };
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  _count?: { products: number };
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  price: number;
  pointsPrice: number | null;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  store?: { name: string };
  category?: { name: string };
}

export interface CartItem {
  id: string;
  memberId: string;
  productId: string;
  quantity: number;
  product?: Product & { store?: { id: string; name: string } };
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
export type PaymentMethod = "POINTS" | "CASH";

export interface Order {
  id: string;
  orderNumber: string;
  memberId: string;
  storeId: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  pointsUsed: number;
  totalAmount: number;
  notes: string | null;
  createdAt: string;
  store?: { name: string };
  member?: { firstName: string; lastName: string };
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

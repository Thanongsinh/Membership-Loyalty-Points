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

export interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

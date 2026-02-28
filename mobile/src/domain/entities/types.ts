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
}

export interface Reward {
  id: string;
  name: string;
  description: string | null;
  pointsCost: number;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  memberId: string;
  type: TransactionType;
  points: number;
  description: string | null;
  createdAt: string;
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

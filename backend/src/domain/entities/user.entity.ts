import { Role } from "@prisma/client";

export interface IUser {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface ITokenPayload {
  userId: string;
  email: string;
  role: Role;
}

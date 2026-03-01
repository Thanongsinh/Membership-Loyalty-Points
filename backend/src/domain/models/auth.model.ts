import { IUser } from "../entities/user.entity";

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

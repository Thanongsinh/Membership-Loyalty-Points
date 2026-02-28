import api from "@/lib/api";
import { AuthResponse } from "@/domain/entities/types";

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  return data;
}

export async function registerApi(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", {
    email, password, firstName, lastName, phone,
  });
  return data;
}

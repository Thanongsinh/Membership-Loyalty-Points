import jwt from "jsonwebtoken";
import { ITokenPayload } from "../../domain/entities/user.entity";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default-refresh-secret";

export function generateAccessToken(payload: ITokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(payload: ITokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): ITokenPayload {
  return jwt.verify(token, JWT_SECRET) as ITokenPayload;
}

export function verifyRefreshToken(token: string): ITokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as ITokenPayload;
}

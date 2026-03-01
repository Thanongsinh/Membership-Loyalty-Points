import { prisma } from "../prisma";
import { hashPassword, comparePassword } from "../../core/utilities/hash";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../core/utilities/jwt";
import { AppError } from "../../core/utilities/errors";
import { RegisterDto, LoginDto, AuthResponse } from "../../domain/models/auth.model";
import { ITokenPayload } from "../../domain/entities/user.entity";
import { Role } from "@prisma/client";

export const authService = {
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new AppError(409, "Email already registered");
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: (dto.role as Role) || "MEMBER",
        member: {
          create: {
            firstName: dto.firstName || (dto.name ? dto.name.split(" ")[0] : ""),
            lastName: dto.lastName || (dto.name ? dto.name.split(" ").slice(1).join(" ") : ""),
            phone: dto.phone,
          },
        },
      },
      include: { member: true },
    });

    const payload: ITokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt },
    };
  },

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const valid = await comparePassword(dto.password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, "Invalid email or password");
    }

    const payload: ITokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt },
    };
  },

  async refresh(token: string): Promise<AuthResponse> {
    const decoded = verifyRefreshToken(token);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.refreshToken !== token) {
      throw new AppError(401, "Invalid refresh token");
    }

    const payload: ITokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt },
    };
  },
};

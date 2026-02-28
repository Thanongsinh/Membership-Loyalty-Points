import { Role } from "@prisma/client";
import { prisma } from "../prisma";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: { email: string; passwordHash: string; role?: Role }) {
    return prisma.user.create({ data });
  },

  updateRefreshToken(id: string, refreshToken: string | null) {
    return prisma.user.update({ where: { id }, data: { refreshToken } });
  },
};

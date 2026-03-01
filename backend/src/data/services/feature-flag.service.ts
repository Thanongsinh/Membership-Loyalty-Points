import { prisma } from "../prisma";

export const featureFlagService = {
  async getAll() {
    return prisma.featureFlag.findMany({ orderBy: { key: "asc" } });
  },

  async getByKey(key: string) {
    return prisma.featureFlag.findUnique({ where: { key } });
  },

  async isEnabled(key: string): Promise<boolean> {
    const flag = await prisma.featureFlag.findUnique({ where: { key } });
    return flag?.enabled ?? false;
  },

  async create(data: { key: string; name: string; description?: string; enabled?: boolean }) {
    return prisma.featureFlag.create({ data });
  },

  async update(id: string, data: { name?: string; description?: string; enabled?: boolean }) {
    return prisma.featureFlag.update({ where: { id }, data });
  },

  async toggle(id: string) {
    const flag = await prisma.featureFlag.findUniqueOrThrow({ where: { id } });
    return prisma.featureFlag.update({ where: { id }, data: { enabled: !flag.enabled } });
  },

  async remove(id: string) {
    return prisma.featureFlag.delete({ where: { id } });
  },
};

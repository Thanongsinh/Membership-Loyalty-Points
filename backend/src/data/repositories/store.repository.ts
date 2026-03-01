import { prisma } from "../prisma";

export const storeRepository = {
  findAll(skip: number, limit: number, activeOnly = false, search?: string) {
    const where: any = {};
    if (activeOnly) where.isActive = true;
    if (search) where.name = { contains: search, mode: "insensitive" };
    return prisma.store.findMany({
      skip, take: limit, where,
      include: { _count: { select: { staff: true, products: true, orders: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  count(activeOnly = false, search?: string) {
    const where: any = {};
    if (activeOnly) where.isActive = true;
    if (search) where.name = { contains: search, mode: "insensitive" };
    return prisma.store.count({ where });
  },

  findById(id: string) {
    return prisma.store.findUnique({
      where: { id },
      include: { staff: true, _count: { select: { products: true, orders: true } } },
    });
  },

  create(data: { name: string; description?: string; address?: string; phone?: string; openingHours?: string; imageUrl?: string }) {
    return prisma.store.create({ data });
  },

  update(id: string, data: any) {
    return prisma.store.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.store.delete({ where: { id } });
  },
};

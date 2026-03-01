import { prisma } from "../prisma";

export const productRepository = {
  findAll(skip: number, limit: number, filters?: { storeId?: string; categoryId?: string; search?: string; activeOnly?: boolean }) {
    const where: any = {};
    if (filters?.storeId) where.storeId = filters.storeId;
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.activeOnly) where.isActive = true;
    if (filters?.search) where.name = { contains: filters.search, mode: "insensitive" };
    return prisma.product.findMany({
      skip, take: limit, where,
      include: { store: { select: { name: true } }, category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  count(filters?: { storeId?: string; categoryId?: string; search?: string; activeOnly?: boolean }) {
    const where: any = {};
    if (filters?.storeId) where.storeId = filters.storeId;
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.activeOnly) where.isActive = true;
    if (filters?.search) where.name = { contains: filters.search, mode: "insensitive" };
    return prisma.product.count({ where });
  },

  findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { store: { select: { name: true } }, category: { select: { name: true } } },
    });
  },

  create(data: { storeId: string; categoryId?: string; name: string; description?: string; price: number; pointsPrice?: number; stock: number; imageUrl?: string }) {
    return prisma.product.create({ data });
  },

  update(id: string, data: any) {
    return prisma.product.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.product.delete({ where: { id } });
  },
};

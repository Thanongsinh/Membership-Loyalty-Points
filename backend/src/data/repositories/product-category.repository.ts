import { prisma } from "../prisma";

export const productCategoryRepository = {
  findAll(activeOnly = false) {
    return prisma.productCategory.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
  },

  findById(id: string) {
    return prisma.productCategory.findUnique({ where: { id } });
  },

  create(data: { name: string; description?: string; imageUrl?: string }) {
    return prisma.productCategory.create({ data });
  },

  update(id: string, data: any) {
    return prisma.productCategory.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.productCategory.delete({ where: { id } });
  },
};

import { prisma } from "../prisma";

export const productRepository = {
  findAll(skip: number, limit: number, filters?: { storeId?: string; categoryId?: string; search?: string; activeOnly?: boolean; minPrice?: number; maxPrice?: number; minRating?: number; sortBy?: string }) {
    const where: any = {};
    if (filters?.storeId) where.storeId = filters.storeId;
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.activeOnly) where.isActive = true;
    if (filters?.search) where.name = { contains: filters.search, mode: "insensitive" };
    if (filters?.minPrice) where.price = { gte: filters.minPrice };
    if (filters?.maxPrice) where.price = { ...where.price, lte: filters.maxPrice };
    if (filters?.minRating) where.averageRating = { gte: filters.minRating };

    let orderBy: any = { createdAt: "desc" };
    if (filters?.sortBy === "price_asc") orderBy = { price: "asc" };
    else if (filters?.sortBy === "price_desc") orderBy = { price: "desc" };
    else if (filters?.sortBy === "rating") orderBy = { averageRating: "desc" };

    return prisma.product.findMany({
      skip, take: limit, where,
      include: { store: { select: { name: true } }, category: { select: { name: true } }, images: true },
      orderBy,
    });
  },

  count(filters?: { storeId?: string; categoryId?: string; search?: string; activeOnly?: boolean; minPrice?: number; maxPrice?: number; minRating?: number; sortBy?: string }) {
    const where: any = {};
    if (filters?.storeId) where.storeId = filters.storeId;
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.activeOnly) where.isActive = true;
    if (filters?.search) where.name = { contains: filters.search, mode: "insensitive" };
    if (filters?.minPrice) where.price = { gte: filters.minPrice };
    if (filters?.maxPrice) where.price = { ...where.price, lte: filters.maxPrice };
    if (filters?.minRating) where.averageRating = { gte: filters.minRating };
    return prisma.product.count({ where });
  },

  findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { store: { select: { name: true } }, category: { select: { name: true } }, images: { orderBy: { sortOrder: "asc" } } },
    });
  },

  findImages(productId: string) {
    return prisma.productImage.findMany({
      where: { productId },
      orderBy: { sortOrder: "asc" },
    });
  },

  addImage(productId: string, url: string, sortOrder: number) {
    return prisma.productImage.create({
      data: { productId, url, sortOrder },
    });
  },

  removeImage(imageId: string) {
    return prisma.productImage.delete({ where: { id: imageId } });
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

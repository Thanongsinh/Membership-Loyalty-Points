import { prisma } from "../prisma";
import { storeRepository } from "../repositories/store.repository";
import { AppError } from "../../core/utilities/errors";
import { PaginationParams, paginatedResponse } from "../../core/utilities/pagination";

export const storeService = {
  async getAll(params: PaginationParams, activeOnly = false, search?: string) {
    const [data, total] = await Promise.all([
      storeRepository.findAll(params.skip, params.limit, activeOnly, search),
      storeRepository.count(activeOnly, search),
    ]);
    return paginatedResponse(data, total, params);
  },

  async getById(id: string) {
    const store = await storeRepository.findById(id);
    if (!store) throw new AppError(404, "Store not found");
    return store;
  },

  async create(data: any) {
    return storeRepository.create(data);
  },

  async update(id: string, data: any) {
    await this.getById(id);
    return storeRepository.update(id, data);
  },

  async remove(id: string) {
    await this.getById(id);
    return storeRepository.delete(id);
  },

  async assignStaff(storeId: string, userId: string, isManager = false) {
    await this.getById(storeId);
    return prisma.storeStaff.upsert({
      where: { userId_storeId: { userId, storeId } },
      update: { isManager },
      create: { storeId, userId, isManager },
    });
  },

  async removeStaff(storeId: string, userId: string) {
    return prisma.storeStaff.delete({
      where: { userId_storeId: { userId, storeId } },
    });
  },

  async getStaff(storeId: string) {
    return prisma.storeStaff.findMany({ where: { storeId } });
  },
};

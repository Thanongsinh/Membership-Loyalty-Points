import { productRepository } from "../repositories/product.repository";
import { AppError } from "../../core/utilities/errors";
import { PaginationParams, paginatedResponse } from "../../core/utilities/pagination";

export const productService = {
  async getAll(params: PaginationParams, filters?: { storeId?: string; categoryId?: string; search?: string; activeOnly?: boolean; minPrice?: number; maxPrice?: number; minRating?: number; sortBy?: string }) {
    const [data, total] = await Promise.all([
      productRepository.findAll(params.skip, params.limit, filters),
      productRepository.count(filters),
    ]);
    return paginatedResponse(data, total, params);
  },

  async getById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError(404, "Product not found");
    return product;
  },

  async create(data: any) {
    return productRepository.create(data);
  },

  async update(id: string, data: any) {
    await this.getById(id);
    return productRepository.update(id, data);
  },

  async remove(id: string) {
    await this.getById(id);
    return productRepository.delete(id);
  },
};

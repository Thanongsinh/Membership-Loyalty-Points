import { productCategoryRepository } from "../repositories/product-category.repository";
import { AppError } from "../../core/utilities/errors";

export const productCategoryService = {
  async getAll(activeOnly = false) {
    return productCategoryRepository.findAll(activeOnly);
  },

  async getById(id: string) {
    const cat = await productCategoryRepository.findById(id);
    if (!cat) throw new AppError(404, "Category not found");
    return cat;
  },

  async create(data: any) {
    return productCategoryRepository.create(data);
  },

  async update(id: string, data: any) {
    await this.getById(id);
    return productCategoryRepository.update(id, data);
  },

  async remove(id: string) {
    await this.getById(id);
    return productCategoryRepository.delete(id);
  },
};

import { Request, Response } from "express";
import { productCategoryService } from "../../data/services/product-category.service";
import { asyncHandler } from "../../core/utilities/errors";

export const productCategoryController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const activeOnly = req.user!.role === "MEMBER";
    res.json(await productCategoryService.getAll(activeOnly));
  }),

  getById: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    res.json(await productCategoryService.getById(req.params.id));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json(await productCategoryService.create(req.body));
  }),

  update: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    res.json(await productCategoryService.update(req.params.id, req.body));
  }),

  remove: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await productCategoryService.remove(req.params.id);
    res.json({ message: "Category deleted" });
  }),
};

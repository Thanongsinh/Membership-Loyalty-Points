import { Request, Response } from "express";
import { productService } from "../../data/services/product.service";
import { asyncHandler } from "../../core/utilities/errors";
import { parsePagination } from "../../core/utilities/pagination";

export const productController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const params = parsePagination(req);
    const filters = {
      storeId: req.query.storeId as string | undefined,
      categoryId: req.query.categoryId as string | undefined,
      search: req.query.search as string | undefined,
      activeOnly: req.user!.role === "MEMBER",
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
      sortBy: req.query.sortBy as string | undefined,
    };
    res.json(await productService.getAll(params, filters));
  }),

  getById: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    res.json(await productService.getById(req.params.id));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json(await productService.create(req.body));
  }),

  update: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    res.json(await productService.update(req.params.id, req.body));
  }),

  remove: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await productService.remove(req.params.id);
    res.json({ message: "Product deleted" });
  }),
};

import { Request, Response } from "express";
import { storeService } from "../../data/services/store.service";
import { asyncHandler } from "../../core/utilities/errors";
import { parsePagination } from "../../core/utilities/pagination";

export const storeController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const params = parsePagination(req);
    const activeOnly = req.user!.role === "MEMBER";
    const search = req.query.search as string | undefined;
    const result = await storeService.getAll(params, activeOnly, search);
    res.json(result);
  }),

  getById: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    res.json(await storeService.getById(req.params.id));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json(await storeService.create(req.body));
  }),

  update: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    res.json(await storeService.update(req.params.id, req.body));
  }),

  remove: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await storeService.remove(req.params.id);
    res.json({ message: "Store deleted" });
  }),

  assignStaff: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const { userId, isManager } = req.body;
    res.json(await storeService.assignStaff(req.params.id, userId, isManager));
  }),

  removeStaff: asyncHandler(async (req: Request<{ id: string; userId: string }>, res: Response) => {
    await storeService.removeStaff(req.params.id, req.params.userId);
    res.json({ message: "Staff removed" });
  }),

  getStaff: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    res.json(await storeService.getStaff(req.params.id));
  }),
};

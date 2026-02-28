import { Request, Response } from "express";
import { authService } from "../../data/services/auth.service";
import { asyncHandler } from "../../core/utilities/errors";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.json(result);
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token required" });
      return;
    }
    const result = await authService.refresh(refreshToken);
    res.json(result);
  }),
};

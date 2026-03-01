import { Request, Response } from "express";
import { TransactionType } from "@prisma/client";
import { transactionRepository } from "../../data/repositories/transaction.repository";
import { memberRepository } from "../../data/repositories/member.repository";
import { asyncHandler, AppError } from "../../core/utilities/errors";
import { parsePagination, paginatedResponse } from "../../core/utilities/pagination";

export const transactionController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const params = parsePagination(req);
    const type = req.query.type as TransactionType | undefined;
    const search = req.query.search as string | undefined;
    const [data, total] = await Promise.all([
      transactionRepository.findAll(params.skip, params.limit, type, search),
      transactionRepository.countAll(type, search),
    ]);
    res.json(paginatedResponse(data, total, params));
  }),

  getMy: asyncHandler(async (req: Request, res: Response) => {
    const member = await memberRepository.findByUserId(req.user!.userId);
    if (!member) throw new AppError(404, "Member not found");
    const params = parsePagination(req);
    const [data, total] = await Promise.all([
      transactionRepository.findByMemberId(member.id, params.skip, params.limit),
      transactionRepository.countByMemberId(member.id),
    ]);
    res.json(paginatedResponse(data, total, params));
  }),
};

import { prisma } from "../prisma";
import { parsePagination } from "../../core/utilities/pagination";
import { Request } from "express";

interface AuditEntry {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
}

export const auditLogService = {
  async log(entry: AuditEntry) {
    return prisma.auditLog.create({ data: entry });
  },

  async logFromReq(req: Request, action: string, entity: string, entityId?: string, details?: any) {
    return this.log({
      userId: req.user?.userId || "system",
      action,
      entity,
      entityId,
      details,
      ipAddress: req.ip || req.socket.remoteAddress,
    });
  },

  async getAll(req: Request) {
    const { page, limit, skip } = parsePagination(req);
    const where: any = {};

    if (req.query.userId) where.userId = req.query.userId;
    if (req.query.entity) where.entity = req.query.entity;
    if (req.query.action) where.action = req.query.action;

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.auditLog.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },
};

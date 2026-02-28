import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { verifyAccessToken } from "../../core/utilities/jwt";
import { ITokenPayload } from "../../domain/entities/user.entity";

declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const token = header.split(" ")[1];
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
}

import { z } from "zod";
import { Request, Response, NextFunction } from "express";

// Auth
export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(["ADMIN", "STAFF", "MEMBER"]).optional(),
  phone: z.string().optional(),
}).refine(d => d.name || d.firstName, { message: "Name or firstName is required" });

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

// Points
export const earnPointsSchema = z.object({
  memberId: z.string().uuid("Invalid member ID"),
  points: z.number().int().positive("Points must be positive"),
  description: z.string().optional(),
});

export const adjustPointsSchema = z.object({
  memberId: z.string().uuid("Invalid member ID"),
  points: z.number().int("Points must be an integer"),
  description: z.string().optional(),
});

// Rewards
export const createRewardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  pointsCost: z.number().int().positive("Points cost must be positive"),
  stock: z.number().int().min(0).default(0),
  imageUrl: z.string().url().optional().nullable(),
});

// Campaigns
export const createCampaignSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  pointsMultiplier: z.number().min(1).default(1),
  bonusPoints: z.number().int().min(0).default(0),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

// Feature Flags
export const createFeatureFlagSchema = z.object({
  key: z.string().min(1).regex(/^[a-z_]+$/, "Key must be lowercase with underscores"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  enabled: z.boolean().default(false),
});

// System Settings
export const upsertSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  type: z.enum(["string", "number", "boolean", "json"]).default("string"),
  label: z.string().min(1),
  description: z.string().optional(),
  group: z.string().default("general"),
});

// Middleware
export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((e: z.ZodIssue) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return res.status(400).json({ message: "Validation failed", errors });
    }
    req.body = result.data;
    next();
  };
}

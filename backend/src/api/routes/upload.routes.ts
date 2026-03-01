import { Router } from "express";
import { authorize } from "../middleware/auth.middleware";
import { upload } from "../../core/utilities/upload";
import { asyncHandler } from "../../core/utilities/errors";
import { Request, Response } from "express";

const router = Router();

router.post(
  "/image",
  authorize("ADMIN"),
  upload.single("image"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url, filename: req.file.filename });
  })
);

export default router;

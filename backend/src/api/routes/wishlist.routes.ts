import { Router } from "express";
import { wishlistController } from "../controllers/wishlist.controller";
import { authorize } from "../middleware/auth.middleware";

export const wishlistRouter = Router();

wishlistRouter.get("/", authorize("MEMBER"), wishlistController.getMyWishlist);
wishlistRouter.post("/:productId", authorize("MEMBER"), wishlistController.toggle);

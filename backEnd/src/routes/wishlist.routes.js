import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  toggleWishlist,
  getMyWishlist,
  checkWishlistStatus,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

// Tất cả các route này đều yêu cầu đăng nhập
router.post("/toggle/:courseId", authenticate, toggleWishlist);
router.get("/me", authenticate, getMyWishlist);
router.get("/check/:courseId", authenticate, checkWishlistStatus);

export default router;

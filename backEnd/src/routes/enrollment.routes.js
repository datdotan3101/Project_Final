import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  checkout,
  getMyLearning,
} from "../controllers/enrollment.controller.js";

const router = express.Router();

// Tất cả các route này đều yêu cầu đăng nhập (Student, Lecturer hay Admin đều có thể học)
// 1. API Checkout
router.post("/checkout", authenticate, checkout);

// 2. API lấy danh sách My Learning
router.get("/my-learning", authenticate, getMyLearning);

export default router;

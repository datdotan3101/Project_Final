import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  addOrUpdateReview,
  getCourseReviews,
} from "../controllers/review.controller.js";

const router = express.Router();

// Lấy danh sách đánh giá (Ai cũng xem được) -> GET /api/reviews/course/1
router.get("/course/:courseId", getCourseReviews);

// Thêm/Sửa đánh giá (Phải đăng nhập và đã mua) -> POST /api/reviews/course/1
router.post("/course/:courseId", authenticate, addOrUpdateReview);

export default router;

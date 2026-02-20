import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  toggleLessonProgress,
  getCourseProgress,
} from "../controllers/progress.controller.js";

const router = express.Router();

// Bắt buộc đăng nhập để lưu tiến độ
router.use(authenticate);

// 1. Đánh dấu / Bỏ đánh dấu hoàn thành bài học (ID của Lesson)
router.post("/lessons/:lessonId/toggle", toggleLessonProgress);

// 2. Lấy % tiến độ của một khóa học (ID của Course)
router.get("/courses/:courseId", getCourseProgress);

export default router;

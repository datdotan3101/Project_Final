import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { upload } from "../config/upload.js";
import {
  createCourse,
  createSection,
  createLesson,
  getAllCourses,
  getCourseById,
} from "../controllers/course.controller.js";

const router = express.Router();

// 1. LECTURER: Tạo khóa học (có upload 1 file ảnh thumbnail)
router.post(
  "/",
  authenticate,
  authorize("LECTURER", "ADMIN"),
  upload.single("thumbnail"),
  createCourse,
);

// 2. LECTURER: Tạo Section trong khóa học
router.post(
  "/:courseId/sections",
  authenticate,
  authorize("LECTURER", "ADMIN"),
  createSection,
);

// 3. LECTURER: Tạo Lesson trong Section (có upload 1 file video)
router.post(
  "/sections/:sectionId/lessons",
  authenticate,
  authorize("LECTURER", "ADMIN"),
  upload.single("video"), // Bắt field form-data có tên là 'video'
  createLesson,
);

router.get("/", getAllCourses);

router.get("/:courseId", getCourseById);

export default router;

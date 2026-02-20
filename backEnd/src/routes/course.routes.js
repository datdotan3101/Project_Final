import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { upload } from "../config/upload.js";
import {
  createCourse,
  createSection,
  createLesson,
  getAllCourses,
  getCourseById,
  updateCourse,
  updateSection,
  updateLesson, 
  deleteCourse,
  deleteSection,
  deleteLesson
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

router.put(
  "/:id",
  authenticate,
  authorize("LECTURER", "ADMIN"),
  upload.single("thumbnail"),
  updateCourse,
);
router.put(
  "/sections/:sectionId",
  authenticate,
  authorize("LECTURER", "ADMIN"),
  updateSection,
);
router.put(
  "/lessons/:lessonId",
  authenticate,
  authorize("LECTURER", "ADMIN"),
  upload.single("video"),
  updateLesson,
);

// --- ROUTES DELETE (XÓA) ---
router.delete(
  "/:id",
  authenticate,
  authorize("LECTURER", "ADMIN"),
  deleteCourse,
);
router.delete(
  "/sections/:sectionId",
  authenticate,
  authorize("LECTURER", "ADMIN"),
  deleteSection,
);
router.delete(
  "/lessons/:lessonId",
  authenticate,
  authorize("LECTURER", "ADMIN"),
  deleteLesson,
);

export default router;

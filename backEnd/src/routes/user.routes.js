import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  requestLecturer,
  getAllRequests,
  handleLecturerRequest,
} from "../controllers/user.controller.js";

const router = express.Router();

// 1. Student sửa profile hoặc xem profile (Cần đăng nhập)
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);

// 2. Student gửi yêu cầu "Become Lecturer"
router.post(
  "/become-lecturer",
  authenticate,
  authorize("STUDENT"),
  requestLecturer,
);

// 3. Admin xem tất cả các yêu cầu nâng cấp (Chỉ Admin)
router.get(
  "/admin/lecturer-requests",
  authenticate,
  authorize("ADMIN"),
  getAllRequests,
);

// 4. Admin duyệt hoặc từ chối (Chỉ Admin)
router.put(
  "/admin/approve-lecturer/:userId",
  authenticate,
  authorize("ADMIN"),
  handleLecturerRequest,
);

export default router;

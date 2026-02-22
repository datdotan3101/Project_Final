import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", authenticate, getMyNotifications);
router.put("/mark-all-read", authenticate, markAllAsRead);
router.put("/:id/read", authenticate, markAsRead);

export default router;

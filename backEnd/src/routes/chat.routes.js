import express from "express";
import { handleChat } from "../controllers/chat.controller.js";

const router = express.Router();

// Route CHUẨN: Không có 'authenticate' để ai cũng chat được
router.post("/", handleChat);

export default router;

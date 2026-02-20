import express from "express";
import { chatWithAssistant } from "../controllers/chat.controller.js";

const router = express.Router();

// Không cần authenticate để bất kỳ ai (kể cả khách chưa đăng nhập) cũng có thể chat nhờ tư vấn
router.post("/", chatWithAssistant);

export default router;

import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { buyGift, getGiftInfo, redeemGift, verifyEmail } from "../controllers/gift.controller.js";

const router = express.Router();

// 0. Kiểm tra email có thật không
router.post("/verify-email", authenticate, verifyEmail);

// 1. Tặng quà (Yêu cầu thanh toán -> Nằm trong giỏ hàng -> Phải đăng nhập)
router.post("/buy", authenticate, buyGift);

// 2. Lấy thông tin quà từ token trên link email (Public)
router.get("/info/:token", getGiftInfo);

// 3. Đổi token lấy khóa học (Yêu cầu đăng nhập vào tài khoản của người nhận)
router.post("/redeem", authenticate, redeemGift);

export default router;

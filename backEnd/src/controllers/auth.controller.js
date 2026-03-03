import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import prisma from "../config/db.js";

// [POST] /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email này đã được sử dụng!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: hashedPassword,
        role: role === "LECTURER" ? "STUDENT" : role || "STUDENT",
        status: role === "LECTURER" ? "PENDING_LECTURER" : "ACTIVE",
      },
    });

    console.log(
      `New user registered: ${email}, Role: ${newUser.role}, Status: ${newUser.status}`,
    );

    res.status(201).json({
      message: "Đăng ký thành công!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

    // --- Thông báo cho Admin có người đăng ký Giảng viên ---
    if (role === "LECTURER") {
      try {
        const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
        const notificationPromises = admins.map((admin) =>
          prisma.notification.create({
            data: {
              userId: admin.id,
              title: "Yêu cầu Giảng viên mới",
              message: `Người dùng ${name} đã đăng ký làm Giảng viên và đang chờ bạn phê duyệt.`,
              type: "LECTURER_REQUEST",
              link: "/admin/dashboard",
            },
          }),
        );
        await Promise.all(notificationPromises);
      } catch (err) {
        console.error("Lỗi gửi thông báo cho Admin (Lecturer Reg):", err);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi đăng ký." });
  }
};

// [POST] /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    // Kiểm tra nếu tài khoản đang chờ duyệt giảng viên
    if (user.status === "PENDING_LECTURER") {
      return res.status(403).json({
        message:
          "Tài khoản Giảng viên của bạn đang chờ Admin phê duyệt. Vui lòng quay lại sau 24h để đăng nhập!",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi đăng nhập." });
  }
};

// [POST] /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng với email này!" });
    }

    // Tạo mã OTP 6 số ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpires = new Date(Date.now() + 600000); // OTP có hiệu lực trong 10 phút (600.000ms)

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: otp,
        resetPasswordExpires: resetExpires,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Mã OTP khôi phục mật khẩu",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
          <h2 style="text-align: center; color: #1d4ed8;">Khôi phục mật khẩu</h2>
          <p>Chào bạn,</p>
          <p>Bạn đã yêu cầu mã OTP để khôi phục mật khẩu. Mã OTP của bạn là:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1d4ed8; background: #f3f4f6; padding: 10px 20px; border-radius: 5px;">${otp}</span>
          </div>
          <p>Mã này có hiệu lực trong <b>10 phút</b>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
          <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888; text-align: center;">Hệ thống học trực tuyến - Project Final</p>
        </div>
      `,
    };

    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
      } else {
        console.log("------------------------------------------");
        console.log(`Email check: ${email}`);
        console.log(`Mã OTP của bạn là: ${otp}`);
        console.log("------------------------------------------");
      }
    } catch (mailError) {
      console.error("Lỗi gửi email:", mailError);
    }

    res.status(200).json({
      message: "Mã OTP đã được gửi tới email của bạn!",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi server khi yêu cầu khôi phục mật khẩu." });
  }
};

// [POST] /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email: email,
        resetPasswordToken: otp,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Mã OTP không chính xác hoặc đã hết hạn!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi khôi phục mật khẩu." });
  }
};

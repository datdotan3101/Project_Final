import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
      { id: user.id, role: user.role },
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

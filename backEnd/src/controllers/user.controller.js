import prisma from "../config/db.js";

// 1. Lấy thông tin Profile cá nhân
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin profile" });
  }
};

// 2. Student gửi yêu cầu nâng cấp lên Lecturer
export const requestLecturer = async (req, res) => {
  try {
    // Kiểm tra xem đã gửi yêu cầu trước đó chưa
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user.status === "PENDING_LECTURER") {
      return res
        .status(400)
        .json({ message: "Yêu cầu của bạn đang chờ Admin duyệt!" });
    }

    if (user.role === "LECTURER") {
      return res.status(400).json({ message: "Bạn đã là Giảng viên rồi!" });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { status: "PENDING_LECTURER" },
    });

    res.json({
      message: "Gửi yêu cầu thành công. Vui lòng chờ Admin xét duyệt.",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi gửi yêu cầu nâng cấp" });
  }
};

// 3. Admin lấy danh sách các yêu cầu đang chờ (PENDING_LECTURER)
export const getAllRequests = async (req, res) => {
  try {
    const requests = await prisma.user.findMany({
      where: { status: "PENDING_LECTURER" },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách yêu cầu" });
  }
};

// 4. Admin xử lý yêu cầu (Duyệt hoặc Từ chối)
export const handleLecturerRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body; // Action: 'APPROVE' hoặc 'REJECT'

    if (action === "APPROVE") {
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          role: "LECTURER",
          status: "ACTIVE",
        },
      });
      return res.json({ message: "Đã duyệt quyền Giảng viên thành công!" });
    }

    if (action === "REJECT") {
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { status: "ACTIVE" }, // Trả về trạng thái bình thường
      });
      return res.json({ message: "Đã từ chối yêu cầu." });
    }

    res.status(400).json({ message: "Hành động không hợp lệ" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xử lý yêu cầu" });
  }
};

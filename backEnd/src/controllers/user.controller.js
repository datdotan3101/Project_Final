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
        avatar_url: true,
        bio: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin profile" });
  }
};

// 2. Cập nhật Profile (Chỉ nhận dữ liệu JSON, không xử lý upload file)
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar_url } = req.body;
    const userId = parseInt(req.user.id);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        avatar_url,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar_url: true,
        bio: true,
      },
    });

    res.json({
      message: "Cập nhật hồ sơ thành công!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật hồ sơ" });
  }
};

// 3. Student gửi yêu cầu nâng cấp lên Lecturer
export const requestLecturer = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user.status === "PENDING_LECTURER") {
      return res
        .status(400)
        .json({ message: "Yêu cầu của bạn đang chờ Admin duyệt!" });
    }

    if (user.role === "LECTURER") {
      return res.status(400).json({ message: " Bạn đã là Giảng viên rồi!" });
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

// 4. Admin lấy danh sách các yêu cầu đang chờ (PENDING_LECTURER)
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

// 5. Admin xử lý yêu cầu (Duyệt hoặc Từ chối)
export const handleLecturerRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body;

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
        data: { status: "ACTIVE" },
      });
      return res.json({ message: "Đã từ chối yêu cầu." });
    }

    res.status(400).json({ message: "Hành động không hợp lệ" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xử lý yêu cầu" });
  }
};

import prisma from "../config/db.js";

// [GET] Lấy danh sách thông báo của người dùng hiện tại
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy thông báo." });
  }
};

// [PUT] Đánh dấu thông báo là đã đọc
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isRead: true },
    });
    res.status(200).json({ message: "Đã đọc thông báo!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi cập nhật thông báo." });
  }
};

// [PUT] Đánh dấu tất cả là đã đọc
export const markAllAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true },
    });
    res.status(200).json({ message: "Đã duyệt tất cả thông báo!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi cập nhật thông báo." });
  }
};

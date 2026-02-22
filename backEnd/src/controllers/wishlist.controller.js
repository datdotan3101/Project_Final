import prisma from "../config/db.js";

// [POST] /api/wishlist/toggle/:courseId
export const toggleWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id; // Lấy từ token middleware

    // Kiểm tra xem đã có trong wishlist chưa
    const existing = await prisma.wishlist.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: parseInt(courseId),
        },
      },
    });

    if (existing) {
      // Nếu có rồi thì xóa (Unlike)
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });
      return res.status(200).json({
        message: "Đã xóa khỏi danh sách yêu thích",
        isFavorite: false,
      });
    } else {
      // Nếu chưa có thì thêm (Like)
      await prisma.wishlist.create({
        data: {
          user_id: userId,
          course_id: parseInt(courseId),
        },
      });
      return res
        .status(201)
        .json({ message: "Đã thêm vào danh sách yêu thích", isFavorite: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi xử lý Wishlist" });
  }
};

// [GET] /api/wishlist/me
export const getMyWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await prisma.wishlist.findMany({
      where: { user_id: userId },
      include: {
        course: {
          include: {
            lecturer: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Trả về danh sách các course thôi
    const favoriteCourses = wishlist.map((item) => item.course);
    res.status(200).json(favoriteCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi lấy danh sách yêu thích" });
  }
};

// [GET] /api/wishlist/check/:courseId
export const checkWishlistStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.wishlist.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: parseInt(courseId),
        },
      },
    });

    res.status(200).json({ isFavorite: !!existing });
  } catch (error) {
    res.status(500).json({ message: "Lỗi kiểm tra trạng thái yêu thích" });
  }
};

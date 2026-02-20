import prisma from "../config/db.js";

// [POST] Thêm hoặc Cập nhật đánh giá (Chỉ dành cho học viên đã mua khóa học)
export const addOrUpdateReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const studentId = req.user.id;

    // 1. Validate số sao (1 đến 5)
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating phải từ 1 đến 5 sao." });
    }

    // 2. Kiểm tra học viên đã mua khóa học chưa
    const isEnrolled = await prisma.enrollment.findUnique({
      where: {
        student_id_course_id: {
          student_id: studentId,
          course_id: parseInt(courseId),
        },
      },
    });

    if (!isEnrolled) {
      return res
        .status(403)
        .json({ message: "Bạn cần mua khóa học này trước khi đánh giá!" });
    }

    // 3. Upsert Review (Tạo mới hoặc Cập nhật)
    // Prisma sẽ dựa vào @@unique([student_id, course_id]) trong schema để quyết định
    const review = await prisma.review.upsert({
      where: {
        student_id_course_id: {
          student_id: studentId,
          course_id: parseInt(courseId),
        },
      },
      update: {
        rating: parseInt(rating),
        comment: comment || "",
      },
      create: {
        student_id: studentId,
        course_id: parseInt(courseId),
        rating: parseInt(rating),
        comment: comment || "",
      },
    });

    res.status(200).json({ message: "Đã lưu đánh giá của bạn!", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi gửi đánh giá." });
  }
};

// [GET] Lấy danh sách đánh giá của một khóa học (Public)
export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { course_id: parseInt(courseId) },
      include: {
        student: { select: { name: true } }, // Trả về tên người đánh giá
      },
      orderBy: { updatedAt: "desc" },
    });

    // Tính điểm trung bình (Tùy chọn, để FE hiển thị 4.5 sao, 5 sao...)
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews
          ).toFixed(1)
        : 0;

    res.status(200).json({
      total_reviews: totalReviews,
      average_rating: parseFloat(averageRating),
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách đánh giá." });
  }
};

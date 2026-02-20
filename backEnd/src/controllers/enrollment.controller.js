import prisma from "../config/db.js";

// [POST] Xử lý Thanh toán (Checkout)
export const checkout = async (req, res) => {
  try {
    const { courseIds } = req.body; // Frontend sẽ gửi lên mảng [1, 2, 3]
    const studentId = req.user.id; // Lấy từ token của người dùng đăng nhập

    if (!courseIds || courseIds.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống!" });
    }

    // 1. Kiểm tra xem các khóa học này có tồn tại và đã được duyệt chưa
    const validCourses = await prisma.course.findMany({
      where: {
        id: { in: courseIds },
        status: "APPROVED",
      },
    });

    if (validCourses.length !== courseIds.length) {
      return res
        .status(400)
        .json({ message: "Có khóa học không hợp lệ hoặc chưa được duyệt." });
    }

    // 2. Kiểm tra xem học viên đã mua khóa nào trong số này chưa
    const existingEnrollments = await prisma.enrollment.findMany({
      where: {
        student_id: studentId,
        course_id: { in: courseIds },
      },
    });

    if (existingEnrollments.length > 0) {
      return res
        .status(400)
        .json({ message: "Bạn đã sở hữu một số khóa học trong giỏ hàng rồi!" });
    }

    // 3. Tiến hành ghi nhận vào bảng Enrollment (Mua thành công)
    const enrollmentsData = courseIds.map((courseId) => ({
      student_id: studentId,
      course_id: courseId,
    }));

    await prisma.enrollment.createMany({
      data: enrollmentsData,
    });

    res
      .status(200)
      .json({ message: "Thanh toán thành công! Chúc bạn học tốt." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi xử lý thanh toán." });
  }
};

// [GET] Xem danh sách khóa học đã mua (My Learning)
export const getMyLearning = async (req, res) => {
  try {
    const studentId = req.user.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { student_id: studentId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail_url: true,
            lecturer: { select: { name: true } },
          },
        },
      },
      orderBy: { purchasedAt: "desc" },
    });

    // Format lại dữ liệu cho Frontend dễ dùng
    const myCourses = enrollments.map((e) => ({
      enrollment_id: e.id,
      purchased_at: e.purchasedAt,
      course: e.course,
    }));

    res.status(200).json(myCourses);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách khóa học của bạn." });
  }
};

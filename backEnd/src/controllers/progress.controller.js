import prisma from "../config/db.js";

// [POST] Đánh dấu hoàn thành / Hủy hoàn thành bài học
export const toggleLessonProgress = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user.id;

    // 1. Tìm bài học và khóa học chứa bài học đó
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) },
      include: { section: true },
    });

    if (!lesson) {
      return res.status(404).json({ message: "Không tìm thấy bài học!" });
    }

    const courseId = lesson.section.course_id;

    // 2. Kiểm tra xem học viên đã mua khóa học này chưa
    const isEnrolled = await prisma.enrollment.findUnique({
      where: {
        student_id_course_id: { student_id: studentId, course_id: courseId },
      },
    });

    if (!isEnrolled) {
      return res.status(403).json({ message: "Bạn chưa mua khóa học này!" });
    }

    // 3. Kiểm tra trạng thái hiện tại trong LessonProgress
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        student_id_lesson_id: {
          student_id: studentId,
          lesson_id: parseInt(lessonId),
        },
      },
    });

    // 4. Nếu đã có record -> Xóa (Hủy hoàn thành) hoặc Cập nhật is_completed = false
    // Ở đây mình chọn cách xóa record để DB nhẹ hơn, hoặc bạn có thể dùng lệnh update
    if (existingProgress) {
      await prisma.lessonProgress.delete({
        where: { id: existingProgress.id },
      });
      return res
        .status(200)
        .json({
          message: "Đã hủy đánh dấu hoàn thành bài học.",
          is_completed: false,
        });
    }

    // 5. Nếu chưa có -> Tạo mới (Đánh dấu hoàn thành)
    await prisma.lessonProgress.create({
      data: {
        student_id: studentId,
        lesson_id: parseInt(lessonId),
        is_completed: true,
      },
    });

    res
      .status(200)
      .json({ message: "Đã hoàn thành bài học!", is_completed: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật tiến độ bài học." });
  }
};

// [GET] Lấy phần trăm tiến độ của một khóa học cụ thể
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // 1. Kiểm tra xem có mua chưa
    const isEnrolled = await prisma.enrollment.findUnique({
      where: {
        student_id_course_id: {
          student_id: studentId,
          course_id: parseInt(courseId),
        },
      },
    });

    if (!isEnrolled) {
      return res.status(403).json({ message: "Bạn chưa sở hữu khóa học này." });
    }

    // 2. Lấy tổng số bài học của toàn bộ khóa học
    const totalLessons = await prisma.lesson.count({
      where: {
        section: { course_id: parseInt(courseId) },
      },
    });

    // 3. Lấy danh sách các bài học học viên ĐÃ hoàn thành trong khóa này
    const completedProgresses = await prisma.lessonProgress.findMany({
      where: {
        student_id: studentId,
        lesson: { section: { course_id: parseInt(courseId) } },
        is_completed: true,
      },
      select: { lesson_id: true },
    });

    const completedLessonIds = completedProgresses.map((p) => p.lesson_id);
    const completedCount = completedLessonIds.length;

    // 4. Tính phần trăm
    const progressPercentage =
      totalLessons === 0
        ? 0
        : Math.round((completedCount / totalLessons) * 100);

    res.status(200).json({
      course_id: parseInt(courseId),
      total_lessons: totalLessons,
      completed_lessons: completedCount,
      progress_percentage: progressPercentage,
      completed_lesson_ids: completedLessonIds, // Trả về mảng ID để Frontend tick xanh các bài đã học
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu tiến độ." });
  }
};

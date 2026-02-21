import prisma from "../config/db.js";

// [POST] Tạo khóa học mới (Lecturer)
export const createCourse = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    // Lấy đường dẫn file ảnh vừa upload (nếu có)
    const thumbnail_url = req.file ? `/uploads/${req.file.filename}` : null;

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price || 0),
        thumbnail_url,
        lecturer_id: req.user.id, // Lấy ID của Lecturer từ Token
        status: "PENDING", // Mặc định chờ Admin duyệt
      },
    });

    res
      .status(201)
      .json({ message: "Tạo khóa học thành công!", course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tạo khóa học." });
  }
};

// [POST] Tạo Section cho một khóa học
export const createSection = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, order_index } = req.body;

    // Kiểm tra xem khóa học có tồn tại và thuộc về Lecturer này không
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });
    if (!course || course.lecturer_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền thêm section vào khóa học này!" });
    }

    const newSection = await prisma.section.create({
      data: {
        title,
        order_index: parseInt(order_index || 0),
        course_id: parseInt(courseId),
      },
    });

    res
      .status(201)
      .json({ message: "Tạo section thành công!", section: newSection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tạo section." });
  }
};

// [POST] Tạo Lesson cho một Section
export const createLesson = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, content_type, order_index, text_content } = req.body;

    // Lấy Section kèm theo thông tin Course để check quyền
    const section = await prisma.section.findUnique({
      where: { id: parseInt(sectionId) },
      include: { course: true },
    });

    if (!section || section.course.lecturer_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền thêm bài học vào phần này!" });
    }

    // Nếu content_type là VIDEO, lưu đường dẫn file. Nếu là TEXT, lưu nội dung văn bản.
    let content_url_or_text = "";
    if (content_type === "VIDEO" && req.file) {
      content_url_or_text = `/uploads/${req.file.filename}`;
    } else {
      content_url_or_text = text_content || "";
    }

    const newLesson = await prisma.lesson.create({
      data: {
        title,
        content_type: content_type || "VIDEO",
        content_url_or_text,
        order_index: parseInt(order_index || 0),
        section_id: parseInt(sectionId),
      },
    });

    res
      .status(201)
      .json({ message: "Tạo bài học thành công!", lesson: newLesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tạo bài học." });
  }
};

// [GET] Xem danh sách tất cả khóa học (Đã được duyệt)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        status: 'APPROVED' // Chỉ lấy các khóa đã duyệt
      },
      include: {
        lecturer: {
          select: { name: true, email: true } // Lấy thêm tên giảng viên
        }
      },
      orderBy: {
        createdAt: 'desc' // Sắp xếp khóa học mới nhất lên đầu
      }
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách khóa học.' });
  }
};

// [GET] Xem chi tiết một khóa học
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: {
        lecturer: {
          select: { name: true, email: true }
        },
        sections: {
          orderBy: { order_index: 'asc' },
          include: {
            lessons: {
              orderBy: { order_index: 'asc' },
              // Không nên trả về content_url_or_text (video) nếu chưa mua, 
              // nhưng ở bước này ta cứ trả về để test FE trước.
            }
          }
        },
        reviews: true // Lấy kèm các đánh giá
      }
    });

    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học!' });
    }

    // Nếu khóa học chưa duyệt mà người xem không phải là tác giả hoặc admin thì chặn lại
    // (Phần này sẽ cần middleware check role phức tạp hơn, tạm thời ta cho phép xem nếu có link)

    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết khóa học.' });
  }
};

// ==================== CẬP NHẬT (UPDATE) ====================

// [PUT] Sửa khóa học
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, status } = req.body;

    const course = await prisma.course.findUnique({ where: { id: parseInt(id) } });
    
    if (!course) return res.status(404).json({ message: 'Không tìm thấy khóa học!' });
    if (course.lecturer_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Bạn không có quyền sửa khóa học này!' });
    }

    const updateData = {
      title,
      description,
      price: price ? parseFloat(price) : undefined,
    };

    // Nếu Lecturer là người sửa, tự động chuyển status về PENDING để Admin duyệt lại
    if (req.user.role === 'LECTURER') {
      updateData.status = 'PENDING';
    } else if (req.user.role === 'ADMIN' && status) {
      updateData.status = status; // Admin có quyền set thẳng status
    }

    // Nếu có upload ảnh mới
    if (req.file) {
      updateData.thumbnail_url = `/uploads/${req.file.filename}`;
    }

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.status(200).json({ message: 'Cập nhật khóa học thành công!', course: updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật khóa học.' });
  }
};

// [PUT] Sửa Section
export const updateSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, order_index } = req.body;

    const section = await prisma.section.findUnique({
      where: { id: parseInt(sectionId) },
      include: { course: true }
    });

    if (!section) return res.status(404).json({ message: 'Không tìm thấy Section!' });
    if (section.course.lecturer_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Bạn không có quyền sửa section này!' });
    }

    const updatedSection = await prisma.section.update({
      where: { id: parseInt(sectionId) },
      data: {
        title,
        order_index: order_index ? parseInt(order_index) : undefined
      }
    });

    res.status(200).json({ message: 'Cập nhật section thành công!', section: updatedSection });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật section.' });
  }
};

// [PUT] Sửa Lesson
export const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title, content_type, order_index, text_content } = req.body;

    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) },
      include: { section: { include: { course: true } } }
    });

    if (!lesson) return res.status(404).json({ message: 'Không tìm thấy bài học!' });
    if (lesson.section.course.lecturer_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Bạn không có quyền sửa bài học này!' });
    }

    const updateData = {
      title,
      order_index: order_index ? parseInt(order_index) : undefined,
      content_type
    };

    if (content_type === 'VIDEO' && req.file) {
      updateData.content_url_or_text = `/uploads/${req.file.filename}`;
    } else if (content_type === 'TEXT' && text_content) {
      updateData.content_url_or_text = text_content;
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: parseInt(lessonId) },
      data: updateData
    });

    res.status(200).json({ message: 'Cập nhật bài học thành công!', lesson: updatedLesson });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật bài học.' });
  }
};

// ==================== XÓA (DELETE) ====================

// [DELETE] Xóa Khóa học (Prisma Cascade sẽ tự xóa luôn Section và Lesson bên trong)
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({ where: { id: parseInt(id) } });

    if (!course) return res.status(404).json({ message: 'Không tìm thấy khóa học!' });
    if (course.lecturer_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa khóa học này!' });
    }

    await prisma.course.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: 'Đã xóa khóa học thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa khóa học.' });
  }
};

// [DELETE] Xóa Section
export const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const section = await prisma.section.findUnique({
      where: { id: parseInt(sectionId) },
      include: { course: true }
    });

    if (!section) return res.status(404).json({ message: 'Không tìm thấy Section!' });
    if (section.course.lecturer_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa section này!' });
    }

    await prisma.section.delete({ where: { id: parseInt(sectionId) } });
    res.status(200).json({ message: 'Đã xóa section thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa section.' });
  }
};

// [DELETE] Xóa Lesson
export const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) },
      include: { section: { include: { course: true } } }
    });

    if (!lesson) return res.status(404).json({ message: 'Không tìm thấy bài học!' });
    if (lesson.section.course.lecturer_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa bài học này!' });
    }

    await prisma.lesson.delete({ where: { id: parseInt(lessonId) } });
    res.status(200).json({ message: 'Đã xóa bài học thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa bài học.' });
  }
};

// [GET] Xem danh sách khóa học của chính Giảng viên đang đăng nhập
export const getLecturerCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        lecturer_id: req.user.id // Lọc theo ID của giảng viên từ token
      },
      orderBy: {
        createdAt: 'desc' // Xếp khóa học mới nhất lên đầu
      }
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách khóa học của bạn.' });
  }
};
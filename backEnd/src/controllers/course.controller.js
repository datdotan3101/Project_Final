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
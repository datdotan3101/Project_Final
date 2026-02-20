import prisma from "../config/db.js";
import { Ollama } from "ollama";

// Khởi tạo kết nối tới Ollama đang chạy dưới background (Mặc định ở port 11434)
const ollama = new Ollama({ host: "http://127.0.0.1:11434" });

export const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Vui lòng nhập câu hỏi." });
    }

    // 1. Truy xuất dữ liệu khóa học từ Database để AI có "kiến thức" thực tế
    const courses = await prisma.course.findMany({
      where: { status: "APPROVED" },
      select: { id: true, title: true, price: true, description: true },
    });

    // 2. Định dạng dữ liệu khóa học thành chuỗi văn bản cho Prompt
    const courseContext = courses
      .map(
        (c) =>
          `- ID: ${c.id} | Tên: ${c.title} | Giá: ${c.price} VNĐ | Mô tả: ${c.description || "Không có"}`,
      )
      .join("\n");

    // 3. Xây dựng System Prompt (Định hình nhân cách và nhiệm vụ cho AI)
    const systemPrompt = `Bạn là một trợ lý ảo thông minh, thân thiện và chuyên nghiệp trên một nền tảng học trực tuyến. 
    Nhiệm vụ của bạn là giúp học viên tìm kiếm khóa học phù hợp và giải đáp thắc mắc. 
    Luôn trả lời bằng tiếng Việt một cách tự nhiên, ngắn gọn.
    
    Dưới đây là danh sách toàn bộ khóa học hiện có trên hệ thống:
    ${courseContext}
    
    Nếu người dùng hỏi về khóa học, hãy sử dụng danh sách trên để tư vấn. Nếu giới thiệu, hãy nhắc nhở họ ID khóa học để họ dễ dàng thêm vào giỏ hàng. Nếu người dùng hỏi ngoài lề, hãy lịch sự lái câu chuyện về việc học tập.`;

    // 4. Gửi yêu cầu tới Ollama
    const response = await ollama.chat({
      model: "qwen2.5:3b", // Đảm bảo tên model trùng khớp với model bạn đã tải ở Bước 1
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      stream: false, // Tạm thời để false để lấy full câu trả lời một lần (Dễ test trên Postman)
    });

    // 5. Trả kết quả về cho Frontend
    res.status(200).json({
      reply: response.message.content,
    });
  } catch (error) {
    console.error("Ollama Error:", error);
    res
      .status(500)
      .json({
        message:
          "Xin lỗi, trợ lý AI đang quá tải hoặc máy chủ chưa bật Ollama. Vui lòng thử lại sau.",
      });
  }
};

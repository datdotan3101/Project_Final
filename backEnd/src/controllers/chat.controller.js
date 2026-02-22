import axios from "axios";
import prisma from "../config/db.js";

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Vui lòng nhập câu hỏi." });
    }

    console.log(`[Chatbot] Nhận được câu hỏi: "${message}"`);

    // =====================================================================
    // BƯỚC 1: LẤY DANH SÁCH KHÓA HỌC TỪ DATABASE (Chỉ lấy khóa ĐÃ DUYỆT)
    // =====================================================================
    const courses = await prisma.course.findMany({
      where: {
        status: "APPROVED",
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        thumbnail_url: true, // Lấy thêm ảnh
        lecturer: {
          select: { name: true },
        },
      },
    });

    // =====================================================================
    // BƯỚC 2: ĐÓNG GÓI DỮ LIỆU THÀNH VĂN BẢN (Để AI đọc hiểu được)
    // =====================================================================
    let courseCatalogText = "Danh sách khóa học hiện có trên hệ thống:\n";

    if (courses.length === 0) {
      courseCatalogText += "- Hiện tại hệ thống chưa có khóa học nào.\n";
    } else {
      courses.forEach((c) => {
        const priceText =
          c.price === 0 ? "Miễn phí" : `${c.price.toLocaleString("vi-VN")} VNĐ`;
        const shortDesc = c.description
          ? c.description.substring(0, 100) + "..."
          : "Không có mô tả chi tiết.";
        courseCatalogText += `- ID: ${c.id} | Tên: "${c.title}" | Giảng viên: ${c.lecturer?.name || "Ẩn danh"} | Giá: ${priceText} | Chi tiết: ${shortDesc}\n`;
      });
    }

    // =====================================================================
    // BƯỚC 3: TẠO PROMPT "THẦN THÁNH" ÉP KHUÔN CHO AI
    // =====================================================================
    const systemPrompt = `Bạn là trợ lý ảo AI thông minh của EduMarket.
    
Dưới đây là danh sách khóa học hiện có:
${courseCatalogText}

NHIỆM VỤ:
1. Trả lời học viên bằng tiếng Việt thân thiện.
2. Gợi ý các khóa học phù hợp từ danh sách trên theo yêu cầu học viên.
3. Nhận diện ý định của người dùng:
   - Nếu người dùng muốn mua hoặc thanh toán một khóa học cụ thể, hãy đặt intent là "BUY".
   - Nếu chỉ đang tìm kiếm hoặc hỏi thông tin, đặt intent là "CHITCHAT".
4. BẠN PHẢI TRẢ VỀ KẾT QUẢ DƯỚI DẠNG JSON với cấu trúc sau:
{
  "text": "Nội dung câu trả lời của bạn ở đây...",
  "intent": "BUY" hoặc "CHITCHAT",
  "recommended_course_ids": [danh sách ID các khóa học liên quan hoặc khóa học người dùng muốn mua]
}

LƯU Ý QUAN TRỌNG:
- Khi intent là "BUY", mảng recommended_course_ids PHẢI chứa ID của khóa học mà người dùng nhắc tới hoặc đồng ý mua.
- Nếu không có khóa học nào phù hợp, để recommended_course_ids là mảng trống [].

Câu hỏi của học viên: "${message}"`;

    // =====================================================================
    // BƯỚC 4: GỬI PROMPT CHO OLLAMA
    // =====================================================================
    const response = await axios.post("http://127.0.0.1:11434/api/generate", {
      model: "qwen2.5:3b",
      prompt: systemPrompt,
      stream: false,
      format: "json",
    });

    console.log("[Chatbot] Đã nhận được câu trả lời từ AI!");

    let aiResult;
    try {
      aiResult = JSON.parse(response.data.response);
    } catch (e) {
      aiResult = {
        text: response.data.response,
        intent: "CHITCHAT",
        recommended_course_ids: [],
      };
    }

    const recommendedCourses = courses.filter((c) =>
      aiResult.recommended_course_ids.includes(c.id),
    );

    res.status(200).json({
      reply: aiResult.text,
      intent: aiResult.intent,
      recommendedCourses: recommendedCourses,
    });
  } catch (error) {
    console.error("Lỗi hệ thống Chatbot:", error.message);
    res.status(500).json({
      message:
        "Xin lỗi, đường truyền đến não bộ AI đang gặp sự cố. Vui lòng thử lại sau!",
    });
  }
};

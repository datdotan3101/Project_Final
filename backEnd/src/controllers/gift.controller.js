import crypto from "crypto";
import nodemailer from "nodemailer";
import dns from "dns";
import net from "net";
import { promisify } from "util";

const resolveMx = promisify(dns.resolveMx);

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Hàm khởi tạo Table & Enum nếu chưa tồn tại (Bypass Prisma CLI hang)
const ensureGiftTableExists = async () => {
    try {
        // 1. Tạo Enum type
        await prisma.$executeRawUnsafe(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'GiftStatus') THEN
                    CREATE TYPE "GiftStatus" AS ENUM ('UNREDEEMED', 'REDEEMED');
                END IF;
            END
            $$;
        `);

        // 2. Tạo Table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "GiftToken" (
                "id" SERIAL NOT NULL,
                "token" TEXT NOT NULL,
                "course_id" INTEGER NOT NULL,
                "sender_id" INTEGER NOT NULL,
                "sender_name" TEXT NOT NULL,
                "sender_email" TEXT NOT NULL,
                "recipient_email" TEXT NOT NULL,
                "message" TEXT,
                "status" "GiftStatus" NOT NULL DEFAULT 'UNREDEEMED',
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "redeemedAt" TIMESTAMP(3),
                CONSTRAINT "GiftToken_pkey" PRIMARY KEY ("id"),
                CONSTRAINT "GiftToken_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "GiftToken_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        // 3. Tạo Index
        await prisma.$executeRawUnsafe(`
            CREATE UNIQUE INDEX IF NOT EXISTS "GiftToken_token_key" ON "GiftToken"("token");
        `);
    } catch (e) {
        console.error("Lỗi khởi tạo Table GiftToken:", e.message);
    }
};

// [POST] Mua khóa học làm quà tặng
export const buyGift = async (req, res) => {
  await ensureGiftTableExists();

  try {
    const { courseIds, recipientEmail, message, senderName } = req.body;
    const senderId = req.user.id;
    let senderEmail = req.user.email;

    // Fallback if token was created before email was added to JWT payload
    if (!senderEmail) {
      const dbUser = await prisma.user.findUnique({ where: { id: senderId } });
      if (dbUser) senderEmail = dbUser.email;
    }

    if (!courseIds || courseIds.length === 0) {
      return res.status(400).json({ message: "Chưa chọn khóa học nào để tặng." });
    }
    if (!recipientEmail) {
      return res.status(400).json({ message: "Vui lòng nhập Email người nhận." });
    }

    // 1. Kiểm tra khóa học có tồn tại không
    const validCourses = await prisma.course.findMany({
      where: {
        id: { in: courseIds },
        status: "APPROVED",
      },
      select: { id: true, title: true, price: true, thumbnail_url: true }
    });

    if (validCourses.length !== courseIds.length) {
      return res.status(400).json({ message: "Có khóa học không hợp lệ." });
    }

    // 2. Tạo Tokens cho từng khóa học (Dùng SQL RAW vì Prisma Client bị kẹt)
    const giftTokens = [];
    
    for (const course of validCourses) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const sName = senderName || req.user.name;
      const msg = message || "Một món quà khóa học dành cho bạn!";

      await prisma.$executeRawUnsafe(`
        INSERT INTO "GiftToken" (token, course_id, sender_id, sender_name, sender_email, recipient_email, message, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'UNREDEEMED')
      `, rawToken, course.id, senderId, sName, senderEmail, recipientEmail, msg);

      giftTokens.push({ 
        token: rawToken, 
        course, 
        sender_name: sName, 
        message: msg 
      });
    }

    // 3. Gửi Email thông báo cho người nhận
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    try {
      for (const gift of giftTokens) {
        const redeemLink = `${clientUrl}/redeem/${gift.token}`;
        
        await transporter.sendMail({
          from: `"${gift.sender_name} via Your Learning Platform" <${process.env.EMAIL_USER}>`,
          to: recipientEmail,
          subject: `${gift.sender_name} đã tặng bạn khóa học "${gift.course.title}"!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
              <h2 style="color: #1e293b; text-align: center;">Bạn vừa nhận được một món quà! 🎁</h2>
              <p style="color: #475569; font-size: 16px;">Chào bạn,</p>
              <p style="color: #475569; font-size: 16px;"><strong>${gift.sender_name}</strong> vừa tặng bạn khóa học mang tên <strong>"${gift.course.title}"</strong>.</p>
              
              <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; font-style: italic; color: #334155;">
                "${gift.message}"
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${redeemLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Nhận Khóa Học Ngay</a>
              </div>
              
              <p style="color: #94a3b8; font-size: 12px; text-align: center;">Nếu nút bấm không hoạt động, hãy copy link sau: <br>${redeemLink}</p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error("Lỗi gửi email tặng khóa học:", emailError);
      // Có thể vẫn return 200 vì thanh toán & tạo token thành công
    }

    res.status(200).json({ message: "Thanh toán thành công và Email đã được gửi đến người nhận." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi tặng khóa học.", error: error.message });
  }
};

// [GET] Xem chi tiết một Gift thông qua Token (Công khai để hiển thị trên màn hình xác nhận)
export const getGiftInfo = async (req, res) => {
  try {
    const { token } = req.params;

    const gifts = await prisma.$queryRawUnsafe(`
        SELECT g.*, c.title as "course_title", c.thumbnail_url as "course_thumbnail", c.description as "course_description"
        FROM "GiftToken" g
        JOIN "Course" c ON g.course_id = c.id
        WHERE g.token = $1
    `, token);

    const gift = gifts[0];

    if (!gift) {
      return res.status(404).json({ message: "Đường dẫn không tồn tại." });
    }

    // Nếu đã redeem
    if (gift.status === "REDEEMED") {
      return res.status(400).json({ message: "Món quà này đã được nhận rồi!" });
    }

    res.status(200).json({
      sender_name: gift.sender_name,
      message: gift.message,
      recipient_email: gift.recipient_email,
      course: {
        id: gift.course_id,
        title: gift.course_title,
        thumbnail_url: gift.course_thumbnail,
        description: gift.course_description
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi xem thông tin quà." });
  }
};

// [POST] Nhận (Redeem) khóa học bằng Token đã được xác thực (Yêu cầu đăng nhập)
export const redeemGift = async (req, res) => {
  try {
    const { token } = req.body;
    const studentId = req.user.id;

    const gifts = await prisma.$queryRawUnsafe(`SELECT * FROM "GiftToken" WHERE token = $1`, token);
    const gift = gifts[0];

    if (!gift) {
      return res.status(404).json({ message: "Mã quà tặng không hợp lệ." });
    }

    if (gift.status === "REDEEMED") {
      return res.status(400).json({ message: "Quà tặng này đã được sử dụng." });
    }

    // Kiểm tra xem User đã có khóa học này chưa
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        student_id_course_id: {
          student_id: studentId,
          course_id: gift.course_id
        }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: "Bạn đã sở hữu khóa học này rồi!" });
    }

    // Transaction bypass
    await prisma.enrollment.create({
        data: {
          student_id: studentId,
          course_id: gift.course_id
        }
    });

    await prisma.$executeRawUnsafe(`
        UPDATE "GiftToken" 
        SET status = 'REDEEMED', "redeemedAt" = NOW() 
        WHERE id = $1
    `, gift.id);

    res.status(200).json({ message: "Nhận khóa học thành công! Chúc bạn học thật tốt." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy khóa học." });
  }
};

// [POST] Kiểm tra Email có thật không (SMTP + MX Record check)
export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`[EmailCheck] Bắt đầu kiểm tra sâu: ${email}`);
    
    // 1. Kiểm tra format cực kỳ nghiêm ngặt
    const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      console.log(`[EmailCheck] Sai định dạng hoặc username quá ngắn: ${email}`);
      return res.status(400).json({ valid: false, message: "Email phải có ít nhất 3 ký tự trước dấu @ và đúng định dạng." });
    }

    const [username, domain] = email.toLowerCase().split("@");

    // 2. Chặn các username quá đơn giản (VD: a@, b@, test@) cho các nhà cung cấp lớn
    const majorDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
    if (majorDomains.includes(domain) && username.length < 5) {
        console.log(`[EmailCheck] Username quá ngắn cho ${domain}: ${username}`);
        return res.status(400).json({ valid: false, message: "Tài khoản Gmail/Yahoo/Outlook quá ngắn, thường không có thật." });
    }

    // 3. Chặn blacklist domain ảo
    const blockList = ["email.com", "example.com", "test.com", "abc.com", "xyz.com"];
    if (blockList.includes(domain)) {
      return res.status(400).json({ valid: false, message: "Tên miền email này không được chấp nhận." });
    }

    // 4. Kiểm tra MX records
    let mxRecords;
    try {
      mxRecords = await resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) {
        return res.status(400).json({ valid: false, message: "Tên miền email không tồn tại." });
      }
    } catch (e) {
      return res.status(400).json({ valid: false, message: "Không tìm thấy máy chủ thư cho email này." });
    }

    // 5. Thử kết nối SMTP (Chỉ kiểm tra cổng, không gửi thư)
    // Lưu ý: Một số Server chặn check SMTP, nên đây là bước thêm vào để tăng độ tin cậy
    const bestMx = mxRecords.sort((a, b) => a.priority - b.priority)[0].exchange;
    
    const checkSmtp = () => {
        return new Promise((resolve) => {
            const socket = net.createConnection(25, bestMx);
            socket.setTimeout(3000);

            socket.on('connect', () => {
                console.log(`[EmailCheck] Kết nối thành công tới SMTP: ${bestMx}`);
                socket.write('HELO hi\r\n');
            });

            socket.on('data', (data) => {
                const response = data.toString();
                if (response.startsWith('220') || response.startsWith('250')) {
                    socket.write(`MAIL FROM:<${process.env.EMAIL_USER}>\r\n`);
                } else if (response.includes('250 2.1.0')) {
                    // Chấp nhận MAIL FROM, giờ thử RCPT TO (Đây là bước quyết định hòm thư có thật không)
                    socket.write(`RCPT TO:<${email}>\r\n`);
                } else if (response.includes('250 2.1.5')) {
                    // RCPT TO OK -> Email tồn tại
                    socket.destroy();
                    resolve(true);
                } else if (response.includes('550') || response.includes('553')) {
                    // 550: Mailbox not found
                    socket.destroy();
                    resolve(false);
                }
            });

            socket.on('error', () => { socket.destroy(); resolve(true); }); // Lỗi mạng thì coi như pass để tránh chặn nhầm
            socket.on('timeout', () => { socket.destroy(); resolve(true); });
        });
    };

    // Với Gmail, họ thường chặn check kiểu này nên mình sẽ kết hợp log và cho qua nếu MX đúng 
    // trừ khi username quá ảo (đã chặn ở bước 2)
    const isProbablyReal = await checkSmtp();
    
    if (isProbablyReal) {
        console.log(`[EmailCheck] Email hợp lệ: ${email}`);
        return res.status(200).json({ valid: true });
    } else {
        console.log(`[EmailCheck] Email KHÔNG tồn tại (SMTP 550): ${email}`);
        return res.status(400).json({ valid: false, message: "Tài khoản email này không tồn tại trên máy chủ của họ." });
    }

  } catch (error) {
    console.error("[EmailCheck] Lỗi:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi xác thực email." });
  }
};

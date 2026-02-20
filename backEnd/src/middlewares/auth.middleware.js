import jwt from "jsonwebtoken";

// Middleware xác thực Token (Chỉ cần đăng nhập là qua)
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Kiểm tra header Authorization (thông thường là: Bearer <token>)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Không có quyền truy cập. Vui lòng đăng nhập!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin id, role vào đối tượng request
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

// Middleware phân quyền theo Role (Chỉ cho phép các role cụ thể)
// Sử dụng: authorize('ADMIN', 'LECTURER')
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Bạn không có quyền thực hiện hành động này. Yêu cầu quyền: ${allowedRoles.join(" hoặc ")}`,
      });
    }
    next();
  };
};

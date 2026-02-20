import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import progressRoutes from "./routes/progress.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ file tĩnh (cho hình ảnh/video upload local)
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running smoothly!" });
});

// Authentication
app.use("/api/auth", authRoutes);

// User
app.use("/api/users", userRoutes);

// Course
app.use("/api/courses", courseRoutes);

// Payment
app.use("/api", enrollmentRoutes);

// Progress
app.use("/api/progress", progressRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

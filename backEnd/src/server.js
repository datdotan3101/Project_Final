import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

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

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Chỗ này sau sẽ import các routes
// app.use('/api/auth', authRoutes);
// app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

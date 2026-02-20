import { PrismaClient } from "@prisma/client";
import pg from "pg";
const { Pool } = pg;
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

// Lấy URL từ biến môi trường
const connectionString = process.env.DATABASE_URL;

// Khởi tạo connection pool của pg
const pool = new Pool({ connectionString });

// Truyền pool vào Prisma Adapter
const adapter = new PrismaPg(pool);

// Khởi tạo PrismaClient với adapter
const prisma = new PrismaClient({ adapter });

export default prisma;

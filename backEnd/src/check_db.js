import prisma from "./config/db.js";

async function checkCols() {
  try {
    const res =
      await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'User'`;
    console.log("Columns:", res);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

checkCols();

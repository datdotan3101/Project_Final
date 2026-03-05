import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const courses = await prisma.course.findMany({ orderBy: { id: 'desc' }, take: 1 });
  console.log(courses);
}
main().finally(() => prisma.$disconnect());

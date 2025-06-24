import { PrismaClient } from "@/app/generated/prisma";

// 型を明示
const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

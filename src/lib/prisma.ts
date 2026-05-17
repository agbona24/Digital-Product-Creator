import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMySQL2 } from "./mysql2-adapter";

function createPrismaClient() {
  const adapter = new PrismaMySQL2(process.env.DATABASE_URL as string);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

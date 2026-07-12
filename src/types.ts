import type { PrismaClient } from "@prisma/client";

export type ContextWithPrisma = {
    Variables: {
        prisma: PrismaClient
    }
}
import type { PrismaClient } from "./generated/prisma/client.js"

export type ContextWithPrisma = {
    Variables: {
        prisma: PrismaClient
    }
}
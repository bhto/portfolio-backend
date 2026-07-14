import type { Context, Next } from "hono";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import "dotenv/config";

const isLocal = process.env.NODE_ENV === "development"
const databaseUrl = isLocal ? process.env.LOCAL_DATABASE_URL : process.env.TURSO_DATABASE_URL
const authToken = !isLocal ? process.env.TURSO_AUTH_TOKEN : undefined 

if (!databaseUrl) {
    throw new Error("LOCAL_DATABASE_URL is not set");
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

const initPrisma = () => {
    const adapter = new PrismaLibSql({
        url: databaseUrl,
        authToken
    });

    return new PrismaClient({ adapter })
}

if (process.env.NODE_ENV === "production") {
    prisma = initPrisma()
} else {
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = initPrisma()
    }
    prisma = globalForPrisma.prisma;
}

function withPrisma(c: Context, next: Next) {
    if (!c.get("prisma")) {
        c.set("prisma", prisma);
    }
    return next();
}

export default withPrisma;
export { prisma };
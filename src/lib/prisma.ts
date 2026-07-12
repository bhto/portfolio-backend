import type { Context, Next } from "hono";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import "dotenv/config";

const isLocal = process.env.NODE_ENV === "development";
const databaseUrl = isLocal
    ? process.env.LOCAL_DATABASE_URL
    : process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

const createPrismaClient = () => {
    const libsqlClient = createClient({
        url: databaseUrl,
        authToken: isLocal ? undefined : authToken,
    });
    const adapter = new PrismaLibSql(libsqlClient as any);
    return new PrismaClient({ adapter });
};

if (process.env.NODE_ENV === "production") {
    prisma = createPrismaClient();
} else {
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = createPrismaClient();
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
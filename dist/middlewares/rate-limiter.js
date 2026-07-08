import { getConnInfo } from '@hono/node-server/conninfo';
const ipCache = new Map();
const LIMIT_MS = 15 * 60 * 1000; // 15 minutes
// Cleanup cache periodically to prevent memory leak
setInterval(() => {
    const now = Date.now();
    for (const [ip, lastTime] of ipCache.entries()) {
        if (now - lastTime > LIMIT_MS) {
            ipCache.delete(ip);
        }
    }
}, LIMIT_MS);
export const rateLimiter = async (c, next) => {
    let ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || '';
    if (!ip) {
        try {
            const conn = getConnInfo(c);
            ip = conn.remote.address || '127.0.0.1';
        }
        catch {
            ip = '127.0.0.1';
        }
    }
    const now = Date.now();
    const lastTime = ipCache.get(ip);
    if (lastTime && (now - lastTime < LIMIT_MS)) {
        const remainingMinutes = Math.ceil((LIMIT_MS - (now - lastTime)) / 60000);
        return c.json({
            error: "Too Many Requests",
            message: `Vous ne pouvez envoyer qu'un seul email toutes les 15 minutes. Veuillez réessayer dans ${remainingMinutes} minute(s).`
        }, 429);
    }
    ipCache.set(ip, now);
    await next();
};

import type { Context, Next } from 'hono'
import { getConnInfo } from '@hono/node-server/conninfo'

const ipCache = new Map<string, number>();
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

export const rateLimiter = async (c: Context, next: Next) => {
    let ip: string = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || '';
    if (!ip) {
        try {
            const conn = getConnInfo(c);
            ip = conn.remote.address || '127.0.0.1';
        } catch {
            ip = '127.0.0.1';
        }
    }

    const now = Date.now();
    const lastTime = ipCache.get(ip);

    if (lastTime && (now - lastTime < LIMIT_MS)) {
        // const remainingMinutes = Math.ceil((LIMIT_MS - (now - lastTime)) / 60000);
        return c.json({
            message: "Too Many Requests",
            success: false
        }, 429);
    }

    ipCache.set(ip, now);
    await next();
};

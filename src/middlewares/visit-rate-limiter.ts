import type { Context, Next } from 'hono'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// 1 requête par IP toutes les minutes
const visitRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.fixedWindow(1, '1 m'),
    analytics: false,
    prefix: 'portfolio:visit-ratelimit',
    timeout: 2000
})

export const visitRateLimiter = async (c: Context, next: Next) => {
    const ip =
        c.req.header('x-forwarded-for')?.split(',')[0].trim() ||
        c.req.header('x-real-ip') ||
        '127.0.0.1'

    const { success } = await visitRatelimit.limit(ip)

    if (!success) {
        return c.json({ message: "Too Many Requests", success: false }, 429)
    }

    await next()
}

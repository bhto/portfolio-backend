import type { Context, Next } from 'hono'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { getClientIp } from '../lib/client-info.js'

// 1 requête par IP toutes les 15 minutes, état partagé via Upstash Redis
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(1, '15 m'),
    analytics: false,
    prefix: 'portfolio:ratelimit',
    timeout: 3000
})

export const rateLimiter = async (c: Context, next: Next) => {
    const ip = getClientIp(c) ?? '127.0.0.1'

    const { success } = await ratelimit.limit(ip)

    if (!success) {
        return c.json({ message: "Too Many Requests", success: false }, 429)
    }

    await next()
}

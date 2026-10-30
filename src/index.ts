import { Hono } from 'hono'
import { handle } from '@hono/vercel'
import { ErrorController } from './controllers/Error.controller.js'
import { Mail } from './services/Mail.service.js'
import { emailValidator } from './validators/email-validator.js'
import { rateLimiter } from './middlewares/rate-limiter.js'
import { visitRateLimiter } from './middlewares/visit-rate-limiter.js'
import type { ContextWithPrisma } from './types.js'
import withPrisma from './lib/prisma.js'
import { visitorValidator } from './validators/visit-validator.js'

const app = new Hono<ContextWithPrisma>()

app.use('*', async (c, next) => {
    const origin = process.env.CLIENT_ADDRESS
    if (origin) {
        c.header('Access-Control-Allow-Origin', origin)
    }
    c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Custom-Header, Upgrade-Insecure-Requests')
    c.header('Access-Control-Expose-Headers', 'Content-Length, X-Kuma-Revision')
    c.header('Access-Control-Max-Age', '600')
    c.header('Access-Control-Allow-Credentials', 'true')

    if (c.req.method === 'OPTIONS') {
        return new Response('', { status: 204 })
    }

    await next()
})

app.get('/', (c) => {
    return c.redirect((process.env.CLIENT_ADDRESS) as string)
})

app.get("/visit/:id", visitRateLimiter, withPrisma, async (c) => {
    const id = c.req.param("id")
    const prisma = c.get("prisma")

    if (id && id.startsWith("visitor-")) {
        const [_, providerId] = id.split("-")
        const clientId = visitorValidator.safeParse(providerId).data

        if (clientId) {
            await prisma.visitor.create({
                data: {
                    clientId
                }
            })
        }
    }

    return c.json({
        message: "Ok",
        success: true
    })
})

app.post("/send-mail", rateLimiter, async (c) => {
    const body = await c.req.json()
    const data = emailValidator.parse(body)

    const mail = new Mail()
    await mail.sendMail(data)

    return c.json({
        message: "Ok",
        success: true
    })
})

app.notFound(ErrorController.notFound)
app.onError(ErrorController.onError)

export default handle(app)
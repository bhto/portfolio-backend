import { Hono } from 'hono'
import { ErrorController } from './controllers/Error.controller.js'
import { Mail } from './services/Mail.service.js'
import { cors } from 'hono/cors'
import { emailValidator } from './validators/email-validator.js'
import { rateLimiter } from './middlewares/rate-limiter.js'
import { visitRateLimiter } from './middlewares/visit-rate-limiter.js'
import type { ContextWithPrisma } from './types.js'
import withPrisma from './lib/prisma.js'
import { visitorValidator } from './validators/visit-validator.js'

const app = new Hono<ContextWithPrisma>()

app.use(
    '*',
    cors({
        origin: process.env.CLIENT_ADDRESS,
        allowMethods: ['POST', 'GET', 'OPTIONS'],
        allowHeaders: [
            'Content-Type',
            'Authorization',
            'X-Custom-Header',
            'Upgrade-Insecure-Requests'
        ],
        exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
        maxAge: 600,
        credentials: true
    })
)

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

export default app
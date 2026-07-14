import { Hono } from 'hono'
import { ErrorController } from './controllers/Error.controller.js'
import { Mail } from './services/Mail.service.js'
import { cors } from 'hono/cors'
import { emailValidator } from './validators/email-validator.js'
import { rateLimiter } from './middlewares/rate-limiter.js'
import type { ContextWithPrisma } from './types.js'

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
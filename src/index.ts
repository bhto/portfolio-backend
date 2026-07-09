import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import dotenv from "dotenv"
import { ErrorController } from './controllers/error.controller.js'
import { Mail } from './services/mail.service.js'
import { cors } from 'hono/cors'
import { emailValidator } from './validators/email-validator.js'
import { rateLimiter } from './middlewares/rate-limiter.js'

dotenv.config()

const app = new Hono()

app.use(
    '*',
    cors({
        origin: process.env.CLIENT_ADDRESS,
        allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
        allowMethods: ['POST', 'GET'],
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

serve({
    fetch: app.fetch,
    port: 3000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
})

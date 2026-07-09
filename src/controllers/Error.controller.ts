import type { Context } from "hono"
import type { HTTPResponseError } from "hono/types"
import type { ContentfulStatusCode } from "hono/utils/http-status"
import { ZodError } from "zod"

export class ErrorController {
    static notFound(c: Context) {
        return c.json({
            message: "404 Not Found",
            success: false
        }, 404)
    }

    static onError(err: Error | HTTPResponseError | ZodError, c: Context) {
        console.error(`[Error]: ${err.stack}`)

        let statusCode: ContentfulStatusCode = 500
        const response = {
            message: "Une erreur innatendue s'est produite.",
            success: false,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        }

        if (err instanceof ZodError) {
            response.message = err.issues[0].message
            statusCode = 400
        }

        return c.json(response, statusCode)
    }
}
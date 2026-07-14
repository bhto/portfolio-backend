import z from "zod"

export const visitorValidator = z.cuid2().optional()
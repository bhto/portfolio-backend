import z from "zod"

export const emailValidator = z.object({
    name: z.string("Le nom est requis.")
        .min(1, "Le nom est trop court")
        .max(100, "Votre nom est trop long"),

    email: z.email("Adresse mail requis ou invalide")
})
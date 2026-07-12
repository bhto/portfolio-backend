import nodemailer from "nodemailer"
import { HTTPException } from "hono/http-exception";
import { EmailTemplate } from "../emails/email-template.js";
import { createElement } from "hono/jsx";
import { renderToString } from "hono/jsx/dom/server";

type SendMail = {
    name: string
    email: string
}

export class Mail {

    private get transporter() {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GOOGLE_EMAIL,
                pass: process.env.GOOGLE_APP_PASSWORD
            },
        })
    }

    public async sendMail({ name, email }: SendMail) {
        try {
            await this.transporter.sendMail({
                from: '"Bérenger Hto" <llsberenger@gmail.com>',
                to: email,
                replyTo: email,
                subject: "Réponse automatique de Bérenger Hto",
                html: renderToString(createElement(EmailTemplate, { name }))
            })
            return true
        } catch (e) {
            throw new HTTPException(500, { message: "Erreur lors l'envoi du mail de vérification. Réessayez ou contactez l'administrateur", cause: e })
        }
    }
}
import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import nodemailer from "nodemailer";
import { HTTPException } from "hono/http-exception";
import "dotenv/config";
import { EmailTemplate } from "../emails/email-template.js";
import { renderToString } from "hono/jsx/dom/server";
export class Mail {
    get transporter() {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GOOGLE_EMAIL,
                pass: process.env.GOOGLE_APP_PASSWORD
            },
        });
    }
    async sendMail({ name, email }) {
        try {
            await this.transporter.sendMail({
                from: '"Bérenger Hto" <llsberenger@gmail.com>',
                to: email,
                replyTo: email,
                subject: "Réponse automatique de Bérenger Hto",
                html: renderToString(_jsx(EmailTemplate, { name: name }))
            });
            return true;
        }
        catch (e) {
            throw new HTTPException(500, { message: "Erreur lors l'envoi du mail de vérification. Réessayez ou contactez l'administrateur", cause: e });
        }
    }
}

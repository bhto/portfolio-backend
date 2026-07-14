export function emailTemplate(name: string): string {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    @media (prefers-color-scheme: dark) {
      .email-body  { background-color: #0b0b0b !important; color: #e5e5e5 !important; }
      .email-content { background-color: #111111 !important; border-color: #262626 !important; }
      .muted { color: #a3a3a3 !important; }
    }
    @media (prefers-color-scheme: light) {
      .email-body  { background-color: #f8fafc !important; color: #171717 !important; }
      .email-content { background-color: #ffffff !important; border-color: #e5e5e5 !important; }
      .muted { color: #737373 !important; }
    }
  </style>
</head>
<body>
  <div
    class="email-body"
    style="margin:0;padding:30px 15px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background-color:#f8fafc;color:#171717;"
  >
    <div
      class="email-content"
      style="max-width:560px;margin:0 auto;padding:32px;background-color:#ffffff;border:1px solid #e5e5e5;border-radius:12px;"
    >
      <p style="margin-top:0;">Bonjour ${name},</p>
      <p>Merci pour votre message et votre intérêt pour mon travail.</p>
      <p>J'ai bien reçu votre demande et je reviendrai vers vous rapidement afin que nous puissions en discuter.</p>
      <p>Bonne journée,</p>
      <p style="margin-bottom:0;font-weight:600;">Bérenger</p>
      <p class="muted" style="font-size:13px;margin-top:8px;">Réponse automatique depuis mon espace de contact.</p>
    </div>
  </div>
</body>
</html>`
}

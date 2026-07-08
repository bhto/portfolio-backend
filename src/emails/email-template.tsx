type EmailTemplateProps = {
    name: string
}

export function EmailTemplate({ name = "Alice" }: EmailTemplateProps) {
    return <>
        <style>
            {`
          @media (prefers-color-scheme: dark) {
            .email-body {
              background-color: #0b0b0b !important;
              color: #e5e5e5 !important;
            }

            .email-content {
              background-color: #111111 !important;
              border-color: #262626 !important;
            }

            .muted {
              color: #a3a3a3 !important;
            }
          }

          @media (prefers-color-scheme: light) {
            .email-body {
              background-color: #f8fafc !important;
              color: #171717 !important;
            }

            .email-content {
              background-color: #ffffff !important;
              border-color: #e5e5e5 !important;
            }

            .muted {
              color: #737373 !important;
            }
          }
        `}
        </style>

        <div
            className="email-body"
            style={{
                margin: 0,
                padding: "30px 15px",
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
                backgroundColor: "#f8fafc",
                color: "#171717",
            }}
        >
            <div
                className="email-content"
                style={{
                    maxWidth: "560px",
                    margin: "0 auto",
                    padding: "32px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "12px",
                }}
            >
                <p style={{ marginTop: 0 }}>
                    Bonjour {name},
                </p>

                <p>
                    Merci pour votre message et votre intérêt pour mon
                    travail.
                </p>

                <p>
                    J'ai bien reçu votre demande et je reviendrai vers vous
                    rapidement afin que nous puissions en discuter.
                </p>

                <p>
                    Bonne journée,
                </p>

                <p
                    style={{
                        marginBottom: 0,
                        fontWeight: 600,
                    }}
                >
                    Bérenger
                </p>

                <p
                    className="muted"
                    style={{
                        fontSize: "13px",
                        marginTop: "8px",
                    }}
                >
                    Réponse automatique depuis mon espace de contact.
                </p>
            </div>
        </div>
    </>

}



import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "hono/jsx/jsx-runtime";
export function EmailTemplate({ name = "Alice" }) {
    return _jsxs(_Fragment, { children: [_jsx("style", { children: `
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
        ` }), _jsx("div", { className: "email-body", style: {
                    margin: 0,
                    padding: "30px 15px",
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
                    backgroundColor: "#f8fafc",
                    color: "#171717",
                }, children: _jsxs("div", { className: "email-content", style: {
                        maxWidth: "560px",
                        margin: "0 auto",
                        padding: "32px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e5e5",
                        borderRadius: "12px",
                    }, children: [_jsxs("p", { style: { marginTop: 0 }, children: ["Bonjour ", name, ","] }), _jsx("p", { children: "Merci pour votre message et votre int\u00E9r\u00EAt pour mon travail." }), _jsx("p", { children: "J'ai bien re\u00E7u votre demande et je reviendrai vers vous rapidement afin que nous puissions en discuter." }), _jsx("p", { children: "Bonne journ\u00E9e," }), _jsx("p", { style: {
                                marginBottom: 0,
                                fontWeight: 600,
                            }, children: "B\u00E9renger" }), _jsx("p", { className: "muted", style: {
                                fontSize: "13px",
                                marginTop: "8px",
                            }, children: "R\u00E9ponse automatique depuis mon espace de contact." })] }) })] });
}

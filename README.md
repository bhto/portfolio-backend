# Bérenger Hto - Portfolio Backend

API REST minimaliste et sécurisée servant de backend au portfolio interactif. Conçue pour gérer l'envoi de réponse automatique de mails via le formulaire de contact.

## Fonctionnalités

- **Envoi d'email** : Route `POST /send-mail` permettant l'envoi de messages depuis le formulaire de contact du portfolio via [Nodemailer](https://nodemailer.com/).
- **Validation des données** : Validation stricte du body de la requête avec [Zod](https://zod.dev/) avant tout traitement.
- **Rate Limiting** : Protection contre les abus — un seul envoi autorisé par adresse IP toutes les 15 minutes.
- **CORS configuré** : Seule l'URL du client définie dans les variables d'environnement est autorisée à effectuer des requêtes.
- **Gestion d'erreurs centralisée** : Contrôleur dédié pour les routes introuvables (`404`) et les erreurs serveur (`500`).
- **Template d'email JSX** : Le corps de l'email est rendu côté serveur via le moteur JSX de Hono (`renderToString`).

## Technologies utilisées

- **Runtime** : Node.js
- **Framework** : [Hono](https://hono.dev/) + `@hono/node-server`
- **Email** : [Nodemailer](https://nodemailer.com/)
- **Validation** : [Zod](https://zod.dev/)
- **Config** : [dotenv](https://github.com/motdotla/dotenv)
- **Langage** : TypeScript (ESNext, NodeNext modules)
- **Outil de dev** : `tsx watch` pour le rechargement à chaud

## Structure du projet

```
src/
├── index.tsx                  # Point d'entrée : serveur, routes, CORS
├── controllers/
│   └── Error.controller.ts    # Gestion des erreurs 404 et 500
├── emails/
│   └── email-template.tsx     # Template JSX du corps de l'email
├── middlewares/
│   └── rate-limiter.ts        # Limitation de débit par IP (1 req / 15 min)
├── services/
│   └── Mail.service.ts        # Logique d'envoi via Nodemailer
└── validators/
    └── email-validator.ts     # Schéma Zod pour la validation du formulaire
```

## Routes API

| Méthode | Route        | Description                                              |
|---------|--------------|----------------------------------------------------------|
| `GET`   | `/`          | Redirige vers l'URL du client (`CLIENT_ADDRESS`)         |
| `POST`  | `/send-mail` | Envoie un email depuis le formulaire de contact          |

### `POST /send-mail`

**Body attendu (JSON) :**
```json
{
  "name": "Prénom Nom",
  "email": "exemple@mail.com"
}
```

**Réponses :**
- `200` — Email envoyé avec succès
- `429` — Trop de requêtes (rate limit atteint)
- `400` — Données invalides (validation Zod)
- `500` — Erreur serveur

## Installation & Démarrage

### Prérequis

- Node.js ≥ 18
- Un gestionnaire de paquets : `pnpm` (recommandé), `npm` ou `yarn`
- Un compte SMTP (ex. Gmail, Brevo, etc.)

### Installation

```bash
pnpm install
```

### Variables d'environnement

Crée un fichier `.env` à la racine du projet :

```env
CLIENT_ADDRESS=http://localhost:5173
GOOGLE_EMAIL=adresse@gmail.com
GOOGLE_APP_PASSWORD=google_mot_de_passe_application
NODE_ENV=development | production
```

### Lancer en développement

```bash
pnpm run dev
```

Le serveur démarre sur [http://localhost:3000](http://localhost:3000).

### Build de production

```bash
pnpm run build
pnpm run start
```

## Licence

Distribué sous licence **Apache 2.0**. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

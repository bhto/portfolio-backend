# Bérenger Hto - Portfolio Backend

API REST minimaliste et sécurisée servant de backend au portfolio interactif. Conçue pour gérer l'envoi de réponse automatique de mails via le formulaire de contact et de l'interaction client.

## Fonctionnalités

- **Envoi d'email** : Route `POST /send-mail` permettant l'envoi de messages depuis le formulaire de contact du portfolio via [Nodemailer](https://nodemailer.com/).
- **Validation des données** : Validation stricte du body de la requête avec [Zod](https://zod.dev/) avant tout traitement.
- **Rate Limiting (contact)** : Protection contre les abus sur `/send-mail` — un seul envoi autorisé par adresse IP toutes les 15 minutes.
- **Rate Limiting (visite)** : Protection sur `/visit/:id` — une seule requête autorisée par adresse IP par minute (adapté à un landing page, pas de rechargement fréquent).
- **CORS configuré** : Seule l'URL du client définie dans les variables d'environnement est autorisée à effectuer des requêtes.
- **Gestion d'erreurs centralisée** : Contrôleur dédié pour les routes introuvables (`404`) et les erreurs serveur (`500`).
- **Template d'email JSX** : Le corps de l'email est rendu côté serveur via le moteur JSX de Hono (`renderToString`).

## Technologies utilisées

- **Runtime** : Vercel
- **Framework** : [Hono](https://hono.dev/)
- **Email** : [Nodemailer](https://nodemailer.com/)
- **Validation** : [Zod](https://zod.dev/)
- **Config** : [dotenv](https://github.com/motdotla/dotenv)
- **Langage** : TypeScript (ESNext, NodeNext modules)

## Structure du projet

```
prisma/
├── schema.prisma              # Définition des modèles de la base de données
├── migrations/                # Migrations crées par Prisma
src/
├── index.tsx                  # Point d'entrée : serveur, routes, CORS
├── controllers/
│   └── Error.controller.ts    # Gestion des erreurs 404 et 500
├── emails/
│   └── email-template.tsx     # Template JSX du corps de l'email
├── middlewares/
│   ├── rate-limiter.ts        # Limitation de débit par IP sur /send-mail (1 req / 15 min)
│   └── visit-rate-limiter.ts  # Limitation de débit par IP sur /visit/:id (1 req / 1 min)
├── services/
│   └── Mail.service.ts        # Logique d'envoi via Nodemailer
├── lib/
│   └── prisma.ts              # Singleton prisma pour effectuer une connexion vers la base de données 
└── validators/
    ├── email-validator.ts     # Schéma Zod pour la validation du formulaire
    └── visit-validator.ts     # Schéma Zod pour la validation de l'id visiteur
    types.ts                   # Types de typescript
prisma.config.ts               # Configuration de prisma
```

## Routes API

| Méthode | Route          | Description                                              |
|---------|----------------|----------------------------------------------------------|
| `GET`   | `/`            | Redirige vers l'URL du client (`CLIENT_ADDRESS`)         |
| `POST`  | `/send-mail`   | Envoie un email depuis le formulaire de contact          |
| `GET`   | `/visit/:id`   | Enregistre la visite d'un utilisateur                    |

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
- `429` — Trop de requêtes (rate limit atteint : 1 req / 15 min par IP)
- `400` — Données invalides (validation Zod)
- `500` — Erreur serveur

### `GET /visit/:id`

**Paramètre :**
- `:id` — Identifiant unique du visiteur au format `visitor-<uuid>` (ex. `visitor-abc123`)

**Comportement :**
Si l'identifiant est valide (préfixe `visitor-`), la visite est enregistrée en base de données via Prisma.

**Réponses :**
- `200` — Visite enregistrée (ou ignorée si id invalide)
- `429` — Trop de requêtes (rate limit atteint : 1 req / 1 min par IP)

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
NODE_ENV=development
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxx
TURSO_DATABASE_URL=libsql://xxx.xxx.turso.io
TURSO_AUTH_TOKEN=xxxxxxxx
LOCAL_DATABASE_URL=file:./dev.db
```

### Lancer en développement

```bash
vercel dev
```

Le serveur démarre sur [http://localhost:3000](http://localhost:3000).

## Licence

Distribué sous licence **Apache 2.0**. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

# ImmoCorp — Next.js Frontend

Refonte complète du frontend Angular vers **Next.js 15** avec TypeScript, Tailwind CSS et support Light/Dark mode.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS** (dark mode via classe)
- **Axios** (API calls + JWT interceptor)
- **Lucide React** (icônes)

## Démarrage

```bash
npm install
# Configurer l'URL du backend
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api" > .env.local
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## Structure

```
src/
├── app/
│   ├── accueil/      # Landing page
│   ├── login/        # Connexion
│   ├── register/     # Inscription
│   ├── dashboard/    # Tableau de bord
│   ├── proprietes/   # Gestion propriétés
│   ├── locataires/   # Gestion locataires
│   ├── baux/         # Gestion baux
│   ├── paiements/    # Gestion paiements
│   ├── alertes/      # Alertes
│   └── admin/        # Administration
├── components/
│   ├── layout/       # AppLayout (sidebar)
│   └── ui/           # ThemeToggle, Modal
├── lib/
│   ├── api.ts        # Instance Axios + interceptors
│   ├── auth.ts       # Helpers auth (localStorage)
│   └── utils.ts      # formatMontant, formatDate, cn
└── types/
    └── models.ts     # Interfaces TypeScript
```

## Dark Mode

Le thème est persisté dans `localStorage` (clé `immocorp_theme`). Le script inline dans le `layout.tsx` empêche le flash au chargement.

## Backend

Le backend Spring Boot doit tourner sur `http://localhost:8080` (configurable via `.env.local`).

Routes attendues :
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/dashboard/stats`
- CRUD : `/api/proprietes`, `/api/locataires`, `/api/baux`, `/api/paiements`, `/api/alertes`
- `GET /api/quittances/{id}` (PDF blob)
- `GET /api/admin/utilisateurs`

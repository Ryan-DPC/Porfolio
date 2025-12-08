# Portfolio Web Moderne - Ryan De Pina Correia

Portfolio web full-stack moderne avec espace admin privé et système de gestion de fichiers.

## 🚀 Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL via Prisma
- **Auth & Storage**: Supabase Auth + Supabase Storage
- **Animations**: Framer Motion
- **Deployment**: Vercel

## 📋 Fonctionnalités

### Portfolio Public
- Multilingue (FR/EN)
- Dark/light mode automatique
- Page d'accueil avec hero section
- Projets avec timeline
- Compétences
- Blog (optionnel)
- Galerie de fichiers publique
- Formulaire de contact
- CV téléchargeable

### Admin Dashboard
- Authentification sécurisée (Email + Password + 2FA)
- CRUD complet pour projets, compétences, blog
- Système OneDrive :
  - Upload de fichiers et dossiers
  - Arborescence illimitée
  - Téléchargement ZIP
  - Taille max: 1GB par fichier

## 🛠️ Installation

### Prérequis

- Node.js 18+
- PostgreSQL
- Compte Supabase

### Étapes

```bash
# 1. Cloner le projet
git clone <repo-url>
cd portfolio

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Remplir les valeurs dans .env

# 4. Configurer la base de données
npx prisma generate
npx prisma db push

# 5. Créer l'utilisateur admin
# Dans Supabase Auth Dashboard ou via code

# 6. Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

## 📝 Configuration

### Variables d'Environnement

Voir `.env.example` pour la liste complète. Variables essentielles :

- `DATABASE_URL` : URL PostgreSQL
- `NEXT_PUBLIC_SUPABASE_URL` : URL Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé publique Supabase
- `SUPABASE_SERVICE_ROLE_KEY` : Clé service Supabase
- `JWT_SECRET` : Secret pour JWT
- `ADMIN_EMAIL` : Email admin

### Supabase Storage

Créer un bucket nommé `portfolio-files` dans Supabase Storage avec les permissions publiques.

### Créer un Utilisateur Admin

Méthode 1 - Via Supabase Dashboard :
1. Aller dans Authentication > Users
2. Créer un utilisateur avec votre email
3. Utiliser le mot de passe pour vous connecter

Méthode 2 - Via Prisma :
```bash
npx prisma studio
# Créer un user avec email et passwordHash (bcrypt)
```

## 🚀 Déploiement Vercel

1. Pusher le code sur GitHub
2. Connecter le repo à Vercel
3. Configurer les variables d'environnement
4. Déployer

**Build Command**: `npx prisma generate && next build`

## 📁 Structure du Projet

```
/
├── app/
│   ├── [locale]/           # Routes i18n
│   │   ├── (public)/       # Pages publiques
│   │   └── admin/          # Pages admin
│   ├── api/                # API routes
│   └── globals.css         # Styles globaux
├── components/
│   ├── layout/             # Header, Footer
│   └── ui/                 # Composants UI
├── lib/
│   ├── prisma.ts           # Client Prisma
│   ├── supabase/           # Clients Supabase
│   ├── auth/               # Session management
│   ├── utils/              # Utilities
│   └── i18n/               # Config i18n
├── locales/
│   ├── fr/                 # Traductions FR
│   └── en/                 # Traductions EN
├── prisma/
│   └── schema.prisma       # Schéma DB
└── types/                  # TypeScript types
```

## 📚 Scripts

```bash
npm run dev      # Serveur de développement
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # Linter
npm run db:push  # Pusher schema Prisma
npm run db:studio # Prisma Studio
```

## 🔐 Sécurité

- Routes admin protégées par middleware
- JWT avec refresh tokens
- Validation des inputs (Zod)
- Passwords hashés (bcrypt)
- 2FA activée pour admin
- Upload validation (type MIME + taille)

## 🎨 Personnalisation

### Couleurs

Modifier dans `tailwind.config.ts` :
- `dark-bg` : Background dark
- `electric-blue` : Couleur accent
- etc.

### Traductions

Modifier les fichiers dans `locales/fr/` et `locales/en/`

## 📄 Licence

MIT

## 👤 Auteur

**Ryan De Pina Correia**
- Portfolio: [ryandpc.com]
- GitHub: [@ryan-dpc]
- Email: contact@ryandpc.com

---

✨ **Bon développement !**
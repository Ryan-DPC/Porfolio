# Installation et Démarrage Rapide

## 📦 Installation

```bash
npm install
```

## 🗄️ Configuration Base de Données

1. Copier `.env.example` vers `.env`
2. Remplir `DATABASE_URL` avec votre PostgreSQL
3. Exécuter:

```bash
npx prisma generate
npx prisma db push
```

## 🔑 Configuration Supabase

1. Créer un projet sur [Supabase](https://supabase.com)
2. Créer un bucket `portfolio-files` dans Storage (public)
3. Copier les clés dans `.env`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 👤 Créer l'Utilisateur Admin

Le seed crée déjà l’admin `ryan.depina@eduvaud.ch` (hash bcrypt, pas le mot de passe en clair).

```bash
# Avec Postgres up + .env rempli :
npx prisma db push
npm run db:seed
```

Pour forcer email/mot de passe depuis `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) :

```bash
npm run db:create-admin
```

## 🚀 Démarrer le Projet

```bash
npm run dev
```

Accéder à: `http://localhost:3000`

Admin login: `http://localhost:3000/fr/admin/login`

## 📝 Ajouter du Contenu

Après connexion admin:
1. Aller sur `/fr/admin/dashboard`
2. Créer des projets via "Nouveau Projet"
3. Uploader des fichiers via "Gérer les Fichiers"
4. Ajouter compétences et articles de blog

## 🌐 Déploiement Vercel

1. Pusher sur GitHub
2. Connecter à Vercel
3. Ajouter toutes les variables d'environnement
4. Déployer

**Build Command**: `npx prisma generate && next build`

---

Pour plus de détails, voir [README.md](./README.md)

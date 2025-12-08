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

### Option 1: Via Prisma Studio
```bash
npx prisma studio
```
- Aller dans `User`
- Créer un nouvel utilisateur avec:
  - email: votre email
  - passwordHash: utiliser [bcrypt generator](https://bcrypt-generator.com/) avec votre mot de passe
  - name: votre nom
  - role: "admin"

### Option 2: Via Script
Créer `scripts/create-admin.ts`:

```typescript
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('votre-mot-de-passe', 10);
  
  await prisma.user.create({
    data: {
      email: 'votre@email.com',
      passwordHash: hashedPassword,
      name: 'Votre Nom',
      role: 'admin',
    },
  });
  
  console.log('Admin créé avec succès!');
}

main();
```

Exécuter:
```bash
npx tsx scripts/create-admin.ts
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

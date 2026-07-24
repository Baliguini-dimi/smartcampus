# SmartCampus — Guide de mise en place locale

## 1. Prérequis à installer

- **Node.js 20 LTS** (via [nodejs.org](https://nodejs.org) ou `nvm`)
- **Git** (si pas déjà installé)
- **PostgreSQL** en local, ou un compte gratuit sur [Neon](https://neon.tech) / [Supabase](https://supabase.com) (recommandé — évite l'install locale)
- Un éditeur : **VS Code** recommandé (extensions : Prisma, Tailwind CSS IntelliSense, ESLint)

## 2. Récupérer l'ancien code (référence, ne sera pas exécuté)

```bash
git clone https://github.com/Baliguini-dimi/smartcampus-saas.git smartcampus-legacy
```

Ce dossier sert uniquement de référence pour consulter le schéma SQL et la logique métier pendant la migration. Il ne sera pas développé davantage.

## 3. Créer le nouveau projet Next.js

```bash
npx create-next-app@latest smartcampus --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*"
cd smartcampus
git init
git add .
git commit -m "Initial commit — Next.js scaffold"
```

Répondre "Yes" à toutes les options par défaut proposées (App Router, Tailwind, ESLint).

## 4. Installer les dépendances principales

```bash
# ORM et base de données
npm install prisma @prisma/client
npx prisma init

# Authentification
npm install next-auth@beta

# Validation
npm install zod

# UI — shadcn/ui
npx shadcn@latest init
# Choisir : style "New York", couleur de base "Slate", CSS variables "Yes"

# Icônes
npm install lucide-react

# Graphiques
npm install recharts

# Utilitaires
npm install date-fns clsx
```

## 5. Configurer la base de données

Dans `.env` :
```
DATABASE_URL="postgresql://user:password@localhost:5432/smartcampus"
NEXTAUTH_SECRET="générer avec: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
GROQ_API_KEY="votre_clé_groq"
CINETPAY_API_KEY="votre_clé_cinetpay"
CINETPAY_SITE_ID="votre_site_id"
```

Créer `.env.example` avec les mêmes clés mais sans valeurs, et l'ajouter au repo (jamais `.env`).

Ajouter au `.gitignore` (normalement déjà présent avec create-next-app) :
```
.env
.env.local
```

## 6. Mettre en place le schéma Prisma

Copier la structure de `docs/PROJECT_KNOWLEDGE.md` section 5, et convertir chaque table du fichier `smartcampus-legacy/database/migrations/001_initial_schema.sql` en modèle Prisma dans `prisma/schema.prisma`. C'est la première vraie tâche de développement (Phase 0 de la roadmap).

Puis :
```bash
npx prisma migrate dev --name init
npx prisma generate
```

## 7. Copier la base de connaissance dans le projet

Placer ces fichiers à la racine du nouveau projet :
```
smartcampus/
├── CLAUDE.md              (à la racine — lu automatiquement par les assistants IA)
└── docs/
    ├── PROJECT_KNOWLEDGE.md
    ├── ARCHITECTURE.md
    ├── DESIGN_SYSTEM.md
    └── SECURITY.md
```

## 8. Lancer le projet

```bash
npm run dev
```
→ ouvrir [http://localhost:3000](http://localhost:3000)

## 9. Créer le nouveau dépôt GitHub

```bash
gh repo create smartcampus --private --source=. --remote=origin
git push -u origin main
```

(Ou créer le dépôt manuellement sur GitHub puis `git remote add origin <url>` + `git push`.)

## 10. Prochaine étape après ce setup

Une fois l'environnement prêt, on attaque la **Phase 0** de la roadmap (`docs/PROJECT_KNOWLEDGE.md` section 7) : conversion complète du schéma Prisma, mise en place de l'authentification NextAuth avec support multi-tenant, et structure de base du design system dans `tailwind.config.ts`.

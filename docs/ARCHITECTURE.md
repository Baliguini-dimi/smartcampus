# SmartCampus — Architecture technique

> Document de référence technique. Toute déviation de stack doit être justifiée et documentée ici avant implémentation.

## 1. Stack retenu

| Couche | Choix | Justification |
|---|---|---|
| Framework | **Next.js 15 (App Router)** + TypeScript | SSR/SSG natif, SEO fort, écosystème le plus demandé actuellement |
<!-- MODIFICATION : UI remplacée -->
| UI | **Tailwind CSS** + **shadcn/ui** (base **Base UI**, style **Vega**) | Base UI choisi plutôt que Radix (rachat WorkOS, maintenance ralentie) |
| Base de données | **PostgreSQL** | Standard robuste, JSON natif, compatible Prisma |
<!-- MODIFICATION : ORM remplacé -->
| ORM | **Prisma 7** | ⚠️ Depuis la v7, l'URL de connexion se configure dans `prisma.config.ts`, plus dans `schema.prisma` |
| Auth | **NextAuth.js (Auth.js) v5** | Sessions sécurisées, multi-provider, compatible RBAC custom |
| IA | **Groq API (LLaMA)** | Conservé du projet original |
| Paiement | **CinetPay** (Mobile Money) | Conservé — adapté au marché cible |
| Emails transactionnels | **Resend** ou **Nodemailer + SMTP** | Reset password, notifications |
| Génération PDF | **@react-pdf/renderer** ou **Puppeteer** | Bulletins, factures |
| Hébergement | **Vercel** (app) + **Neon/Supabase** (PostgreSQL managé) | SSR natif, déploiement continu, scalable |
| Tests | **Vitest** (unitaires) + **Playwright** (E2E) | Non négociable pour un projet "sérieux" |
| CI/CD | **GitHub Actions** | Lint, tests, build à chaque PR |

## 2. Structure de dossiers cible
smartcampus/
├── app/ # App Router Next.js
│ ├── (marketing)/ # Pages publiques : landing, pricing, about
│ │ ├── page.tsx
│ │ ├── pricing/page.tsx
│ │ └── layout.tsx
│ ├── (auth)/ # Login, register, reset password
│ │ ├── login/page.tsx
│ │ ├── register/page.tsx
│ │ └── layout.tsx
│ ├── (app)/ # Espace applicatif authentifié
│ │ ├── dashboard/page.tsx
│ │ ├── students/
│ │ ├── professors/
│ │ ├── courses/
│ │ ├── grades/
│ │ ├── messages/
│ │ ├── ai/
│ │ ├── finance/
│ │ └── layout.tsx # Sidebar + garde d'auth + garde de rôle
│ ├── (super-admin)/ # Back-office multi-tenant
│ ├── api/ # Route handlers (webhooks CinetPay, etc.)
│ └── layout.tsx # Layout racine + metadata SEO globale
├── components/
│ ├── ui/ # shadcn/ui (généré, ne pas modifier à la main)
│ └── features/ # Composants métier (StudentCard, GradeTable, etc.)
├── lib/
│ ├── auth.ts # Config NextAuth
│ ├── prisma.ts # Client Prisma singleton
│ ├── permissions.ts # RBAC — fonctions can(role, action, resource)
│ ├── tenant.ts # Résolution et garde du tenant courant
│ └── validations/ # Schémas Zod par entité
├── prisma/
│ ├── schema.prisma
│ └── migrations/
├── services/
│ ├── ai/ # Intégration Groq
│ ├── payment/ # Intégration CinetPay
│ ├── email/
│ └── pdf/
├── docs/ # Cette base de connaissance
├── tests/
└── public/

text

## 3. Règles d'architecture

1. **Server Components par défaut.** `"use client"` uniquement quand l'interactivité l'exige (formulaires, état local).
2. **Toute mutation de données passe par une Server Action ou un Route Handler**, jamais de logique métier côté client.
3. **Le tenant courant est résolu une fois** (middleware ou layout) et propagé — jamais recalculé à chaque requête de données.
4. **Validation systématique avec Zod** côté serveur, même si le formulaire est déjà validé côté client.
5. **Un seul point d'accès Prisma** (`lib/prisma.ts`), pas d'instanciation multiple.
6. **Pas de logique métier dans les composants UI** — les composants affichent, les services/actions calculent.

## 4. SEO & rendu serveur

- Toutes les pages publiques (`(marketing)`) sont **statiques ou ISR** (Incremental Static Regeneration), jamais client-only.
- `generateMetadata()` obligatoire sur chaque page publique : title, description, Open Graph, Twitter Card.
- Sitemap (`sitemap.ts`) et `robots.ts` générés automatiquement.
- Structure de titres HTML respectée : un seul `<h1>` par page, hiérarchie logique `h2 > h3`.
- Images optimisées via `next/image`, attributs `alt` obligatoires.
- Core Web Vitals surveillés (LCP, CLS, INP) — budget de performance à définir en phase 0.
- L'espace applicatif authentifié (`(app)`) n'a pas besoin de SEO (noindex).

## 5. Sécurité (renvoi à SECURITY.md)

Voir `SECURITY.md` pour le détail. Résumé des piliers :
- Auth via NextAuth (sessions httpOnly, CSRF intégré)
- RBAC vérifié côté serveur sur chaque action
- Isolation tenant systématique dans chaque requête Prisma (`where: { tenantId }`)
- Rate limiting sur les routes sensibles (login, IA, paiement)
- Validation Zod sur toutes les entrées
- Secrets exclusivement en variables d'environnement, jamais commités

## 6. Ce qui est repris du projet PHP original

- Le schéma de données complet (20 tables) → converti en `schema.prisma`
- La logique métier des contrôleurs (calcul de moyennes, gestion des inscriptions, etc.) → réécrite en Server Actions TypeScript
- La structure des plans d'abonnement et des quotas
- Le choix de Groq pour l'IA et CinetPay pour le paiement
- La direction visuelle initiale (bleu marine + orange, typographies Syne/DM Sans) → formalisée dans `DESIGN_SYSTEM.md`

## 7. Ce qui est abandonné

- Le routeur PHP maison, les classes de base vides (`Controller.php`, `Model.php`, `View.php`)
- Bootstrap manuel de session/config
- Absence de gestion de dépendances (composer.json vide)
- Templates PHP procéduraux
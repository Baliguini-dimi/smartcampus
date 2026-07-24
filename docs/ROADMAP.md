# SmartCampus — Feuille de route complète (idée → déploiement)

> Méthode : on avance **une phase à la fois**. Chaque phase a un livrable concret et une checklist de validation. On ne passe à la phase suivante que quand la checklist est cochée. Ce document est mis à jour au fur et à mesure (cases cochées, ajustements).

## Méthode de travail

1. À chaque session, on annonce quelle phase/étape est en cours.
2. Je fournis le code / la config, tu l'appliques en local (ou je te guide en local si besoin).
3. On valide ensemble avant de passer à la suite — pas de saut de phase.
4. Les fichiers `docs/*.md` restent la référence ; si une décision change, on les met à jour immédiatement.
5. **Budget : 0 FCFA jusqu'au lancement réel.** Toutes les ressources ci-dessous ont un palier gratuit suffisant pour développer, tester et même lancer en production à petite échelle.

---

## Ressources gratuites utilisées (récapitulatif)

| Besoin | Outil | Palier gratuit |
|---|---|---|
| Code source | GitHub | Dépôts privés illimités |
| Hébergement app | Vercel | Illimité pour projets persos/petits SaaS |
| Base de données | Neon (PostgreSQL) | 0,5 Go, largement suffisant au départ |
| Auth | NextAuth.js | Open source, gratuit |
| IA | Groq API | Quota gratuit généreux (LLaMA) |
| Emails transactionnels | Resend | 3 000 emails/mois gratuits |
| Paiement | CinetPay | Mode test/sandbox gratuit ; commission uniquement sur transactions réelles |
| CI/CD | GitHub Actions | 2 000 minutes/mois gratuites (repo privé) |
| Design/icônes/polices | shadcn/ui, Lucide, Google Fonts | Gratuits, open source |
| Monitoring erreurs | Sentry (palier free) | 5 000 erreurs/mois |
| Nom de domaine | (à prévoir plus tard) | Vercel fournit un sous-domaine gratuit (`.vercel.app`) en attendant |

Rien à payer avant d'avoir un vrai produit qui tourne.

---

## Phase 0 — Fondations techniques
**Objectif :** projet Next.js opérationnel en local, connecté à une vraie base de données, avec le design system de base.

- [ ] Installer Node.js, Git, VS Code
- [ ] Créer le projet Next.js (TypeScript, Tailwind, App Router)
- [ ] Créer un compte Neon (PostgreSQL gratuit) et récupérer la `DATABASE_URL`
- [ ] Installer Prisma, écrire `schema.prisma` (conversion des 20 tables identifiées)
- [ ] Première migration (`prisma migrate dev`)
- [ ] Initialiser shadcn/ui + Tailwind avec les tokens du `DESIGN_SYSTEM.md` (couleurs, polices Syne/DM Sans)
- [ ] Créer le dépôt GitHub privé, premier commit
- [ ] Copier `CLAUDE.md` et `docs/*.md` dans le projet

**Livrable :** `npm run dev` fonctionne, la page d'accueil affiche "SmartCampus" avec la bonne police/couleur, la BDD est connectée et vide mais migrée.

---

## Phase 1 — Authentification & multi-tenant
**Objectif :** un utilisateur peut s'inscrire, se connecter, et arrive sur un dashboard qui dépend de son rôle et de son tenant.

- [ ] Config NextAuth (Credentials provider, sessions httpOnly)
- [ ] Pages login / register / reset password (dans `(auth)/`)
- [ ] Résolution du tenant courant (`lib/tenant.ts`) via sous-domaine ou slug
- [ ] Middleware de garde : routes `(app)` inaccessibles sans session
- [ ] RBAC de base (`lib/permissions.ts`) : `super_admin`, `admin`, `professor`, `student`, `parent`
- [ ] Dashboard par rôle (une page simple qui affiche "Bienvenue [rôle]" pour l'instant)
- [ ] Tests : un tenant ne peut pas voir les données d'un autre (test automatisé de base)

**Livrable :** cycle complet inscription → connexion → dashboard filtré par rôle et tenant, sécurisé côté serveur.

---

## Phase 2 — Cœur académique
**Objectif :** le produit fait ce pour quoi il existe : gérer étudiants, professeurs, cours, notes, présences.

- [ ] CRUD Étudiants (avec filtres département/niveau/statut)
- [ ] CRUD Professeurs
- [ ] CRUD Cours (+ inscriptions étudiant ↔ cours)
- [ ] Saisie et calcul des notes (devoir/partiel/final/bonus → moyenne, mention)
- [ ] Présences par séance
- [ ] Emploi du temps (vue calendrier simple)
- [ ] Validation Zod sur tous les formulaires
- [ ] Tests unitaires sur le calcul de moyenne (logique critique)

**Livrable :** un admin peut créer un établissement fonctionnel de bout en bout : ajouter des profs, des cours, inscrire des étudiants, saisir des notes.

---

## Phase 3 — IA pédagogique
**Objectif :** intégration Groq pour les conversations IA et la génération de quiz.

- [ ] Compte Groq (clé API gratuite)
- [ ] Service `services/ai/` : appel API, gestion du contexte (général/cours/notes/carrière)
- [ ] Interface de chat IA (`app/(app)/ai/`)
- [ ] Génération de quiz par IA (questions, réponses, explications)
- [ ] Quotas d'appels IA par plan, décrémentés et vérifiés avant chaque appel
- [ ] Rate limiting sur les routes IA

**Livrable :** un étudiant peut discuter avec l'IA et un professeur peut générer un quiz automatiquement, dans la limite du quota de son plan.

---

## Phase 4 — Communication
**Objectif :** messagerie, annonces, notifications.

- [ ] Messagerie interne (fils de discussion, lu/non lu)
- [ ] Annonces (ciblage par rôle/département, expiration)
- [ ] Notifications (cloche, liste, marquage lu)
- [ ] Emails transactionnels via Resend (reset password, notification importante)

**Livrable :** les utilisateurs communiquent dans l'app sans sortir vers l'email pour l'essentiel.

---

## Phase 5 — Gamification
**Objectif :** XP, badges, classement — l'engagement étudiant.

- [ ] Système XP (transactions tracées, niveau calculé)
- [ ] Badges à conditions (JSON) + déclenchement automatique
- [ ] Leaderboard par promotion/établissement
- [ ] Intégration visuelle dans l'espace étudiant (sans casser la cohérence du design system)

**Livrable :** un étudiant gagne de l'XP, débloque des badges, se voit dans un classement.

---

## Phase 6 — Finance & abonnements SaaS
**Objectif :** facturation des étudiants + abonnement SaaS des établissements, paiement Mobile Money.

- [ ] Factures étudiants (frais de scolarité)
- [ ] Intégration CinetPay en mode sandbox (paiement test)
- [ ] Webhook de confirmation de paiement (vérification de signature obligatoire)
- [ ] Abonnements SaaS des tenants (Freemium/Pro/Premium), passage de plan
- [ ] Application réelle des quotas par plan (blocage si dépassement)

**Livrable :** un étudiant peut payer ses frais en mode test, un tenant peut changer de plan, les quotas sont vraiment appliqués.

---

## Phase 7 — Back-office Super Admin & mise en production
**Objectif :** gérer tous les tenants depuis un espace transverse, puis déployer.

- [ ] Back-office Super Admin (liste des tenants, statuts, plans, facturation globale)
- [ ] Logs d'activité consultables (par tenant / global)
- [ ] Metadata SEO complètes sur toutes les pages publiques + sitemap.xml + robots.txt
- [ ] Audit sécurité final (checklist `SECURITY.md` section 10)
- [ ] Déploiement sur Vercel (connecté au repo GitHub, déploiement continu)
- [ ] Passage de Neon en base "production" (ou upgrade si le volume l'exige)
- [ ] Tests E2E Playwright sur les parcours critiques (login, paiement, notes)

**Livrable : le SaaS est en ligne, accessible publiquement, avec un vrai établissement de démo.**

---

## Après le déploiement (pour la suite, hors scope immédiat)

- Nom de domaine personnalisé
- Marque blanche / domaine custom par tenant (feature Premium)
- Portail parents (lecture seule)
- App mobile ou PWA
- Recherche d'investisseurs / accélérateurs tech Afrique francophone (avec le produit fonctionnel comme preuve)

---

## Où on en est

**Phase actuelle : Phase 0 — Fondations techniques**, étape "Créer le projet Next.js en local".

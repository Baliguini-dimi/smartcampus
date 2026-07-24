# SmartCampus — Base de connaissance projet

> Ce document est la **source de vérité fonctionnelle** du projet. Toute décision de développement (humaine ou IA) doit s'y référer en premier. En cas de conflit entre ce document et une suggestion ponctuelle, ce document prévaut.

## 1. Vision

SmartCampus est une plateforme SaaS multi-établissements de gestion académique, pensée pour les universités et écoles d'Afrique francophone. Elle centralise la gestion des étudiants, professeurs, cours, notes, présences, finances, et intègre de l'IA pédagogique et de la gamification pour l'engagement étudiant.

**Modèle économique :** SaaS multi-tenant par abonnement (Freemium → Pro → Premium), facturé en FCFA, paiement via Mobile Money (CinetPay).

## 2. Utilisateurs cibles (rôles)

| Rôle | Description | Accès principal |
|---|---|---|
| `super_admin` | Anthropic du produit — gère tous les établissements | Back-office global, facturation, plans |
| `admin` | Administrateur d'un établissement (tenant) | Gestion complète de son établissement |
| `professor` | Enseignant | Ses cours, ses étudiants, notes, présences, quiz |
| `student` | Étudiant | Ses notes, cours, messages, IA, gamification |
| `parent` | Parent/tuteur (accès lecture) | Suivi de son enfant (notes, présences, finances) |

## 3. Architecture multi-tenant

- Un **tenant** = un établissement (université, école)
- Isolation des données par `tenant_id` sur toutes les tables métier
- Chaque tenant a : son propre sous-domaine ou slug, sa charte (couleurs primaire/accent), son plan d'abonnement, ses quotas (étudiants, cours, professeurs, appels IA/mois)
- `super_admin` n'a pas de `tenant_id` (accès transverse)

## 4. Modules fonctionnels

### 4.1 Gestion académique (cœur du produit)
- **Étudiants** : profil, matricule, filière, niveau (L1→D1), année académique, GPA, statut (actif/suspendu/diplômé/abandon), bourse
- **Professeurs** : profil, département, spécialisation, qualification, bureau/horaires
- **Cours** : code, titre, objectifs, syllabus, département, niveau, crédits, coefficient, capacité, semestre, type (CM/TD/TP/Mixte), ressources pédagogiques
- **Inscriptions** : lien étudiant ↔ cours, statut, % de complétion
- **Notes** : composantes pondérables (devoir/partiel/final/bonus), moyenne calculée, lettre, mention, rattrapage
- **Présences** : par séance, statut (présent/absent/retard/excusé)
- **Emploi du temps** : jour, créneau, salle, par semestre

### 4.2 IA Pédagogique
- Conversations IA contextualisées (général / cours / notes / carrière) via Groq (LLaMA)
- Génération de quiz (questions à choix multiples, explications, points)
- Quotas d'appels IA par plan d'abonnement, réinitialisés mensuellement

### 4.3 Gamification
- Système XP et niveaux par utilisateur
- Badges à conditions (JSON) : première connexion, streak de connexion, quiz réussis, mentions, etc.
- Classements (leaderboard) par promotion/établissement
- Transactions XP tracées (raison, référence)

### 4.4 Communication
- Messagerie interne (fils de discussion, lu/non lu)
- Annonces (priorité, ciblage par rôle/département, expiration, compteur de vues)
- Notifications (type, lien, données JSON, lu/non lu)

### 4.5 Finance
- Factures (frais de scolarité, statut, échéance)
- Paiements (Mobile Money via CinetPay, espèces, virement, carte)
- Abonnements SaaS (cycle mensuel/annuel, statut, historique)

### 4.6 Administration & sécurité
- Logs d'activité (action, sujet, IP, user-agent, données)
- Rate limiting (protection brute-force par clé)
- RBAC (contrôle d'accès par rôle)

## 5. Modèle de données (issu du schéma existant, à migrer vers Prisma)

Entités principales et leurs relations clés :

```
Plan 1—* Tenant 1—* User
Tenant 1—* Student / Professor (extensions de User)
Tenant 1—* Course —* Enrollment *— Student
Course 1—* Grade / Attendance / Schedule / Quiz
User 1—* Message (sender/recipient) / Notification
Tenant 1—* Announcement
User 1—* AiConversation 1—* AiMessage
Quiz 1—* QuizQuestion ; Quiz 1—* QuizAttempt (par Student)
User 1—* UserBadge *— Badge ; User 1—* XpTransaction
Student 1—* Invoice 1—* Payment
Tenant 1—* Subscription (lié à Plan)
Tenant/User 1—* ActivityLog
```

**20 entités identifiées** : Plan, Tenant, User, Student, Professor, Course, Enrollment, Grade, Attendance, Schedule, Message, Announcement, AiConversation, AiMessage, Quiz, QuizQuestion, QuizAttempt, Badge, UserBadge, XpTransaction, Notification, Invoice, Payment, Subscription, ActivityLog, RateLimit.

Le schéma SQL original (`database/migrations/001_initial_schema.sql`) sert de référence pour convertir en `schema.prisma` — tous les champs, contraintes, index et enums doivent être conservés à l'équivalent Prisma/PostgreSQL près.

**Changement de SGBD :** migration de MySQL vers **PostgreSQL** (meilleur support JSON natif, meilleure intégration avec Prisma/Next.js, standard de l'écosystème JS moderne).

## 6. Plans d'abonnement (à conserver)

| Plan | Prix/mois | Étudiants max | Cours max | Profs max | Appels IA/mois | Features |
|---|---|---|---|---|---|---|
| Gratuit | 0 FCFA | 50 | 10 | 5 | 20 | Dashboard, étudiants, cours, notes, messages, IA basique |
| Pro | 15 000 FCFA | 500 | 100 | 20 | 200 | + IA complète, quiz, gamification, export PDF, annonces, présences |
| Premium | 35 000 FCFA | Illimité | Illimité | Illimité | Illimité | + marque blanche, domaine custom, support prioritaire, analytics avancées, finance, SMS, portail parents |

## 7. Roadmap fonctionnelle (reprise du projet original, réordonnée pour le nouveau stack)

- [ ] **Phase 0** — Setup Next.js/TS, Prisma, auth, design system
- [ ] **Phase 1** — Multi-tenant + Auth (login, register, reset password) + Dashboard par rôle
- [ ] **Phase 2** — Étudiants, Professeurs, Cours, Inscriptions, Notes, Présences, Emploi du temps
- [ ] **Phase 3** — IA pédagogique (Groq) : conversations, génération de quiz
- [ ] **Phase 4** — Messagerie, Annonces, Notifications
- [ ] **Phase 5** — Gamification (XP, badges, leaderboard)
- [ ] **Phase 6** — Finance (factures, paiement CinetPay, abonnements SaaS)
- [ ] **Phase 7** — Back-office Super Admin + déploiement production

## 8. Règles produit non négociables

1. **Isolation stricte des données par tenant** — aucune requête ne doit pouvoir retourner des données d'un autre tenant.
2. **RBAC vérifié côté serveur** à chaque action, jamais uniquement côté client.
3. **Tous les montants** sont stockés en FCFA (ou devise du tenant), jamais de calcul flottant approximatif pour l'argent (utiliser des entiers en centimes ou `Decimal`).
4. **Quotas de plan** vérifiés avant toute action consommatrice (appel IA, ajout étudiant, etc.).
5. **Aucune fonctionnalité "démo" ou fake data en production.**

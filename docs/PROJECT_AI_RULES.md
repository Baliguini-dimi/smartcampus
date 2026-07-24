# SmartCampus — Instructions pour assistants IA (Claude Code, Cursor, etc.)

> Ce fichier doit être placé à la racine du projet (`CLAUDE.md` ou équivalent) pour que tout assistant IA travaillant sur le code le lise en priorité. Objectif : éviter les hallucinations, les décisions incohérentes, et la dispersion du scope.

## 1. Documents à lire avant toute tâche

Avant de générer du code, un assistant IA doit avoir pris connaissance de :
1. `docs/PROJECT_KNOWLEDGE.md` — ce que fait le produit, pour qui, avec quelles règles
2. `docs/ARCHITECTURE.md` — le stack et la structure de dossiers imposée
3. `docs/DESIGN_SYSTEM.md` — palette, typographies, composants autorisés
4. `docs/SECURITY.md` — règles de sécurité non négociables
5. `prisma/schema.prisma` — le modèle de données réel (source de vérité, pas la mémoire du modèle)

## 2. Règles strictes

- **Ne jamais inventer un champ, une table ou une route qui n'existe pas dans `schema.prisma` ou dans la structure de dossiers définie.** En cas de doute, lire le fichier concerné avant d'écrire du code.
- **Ne jamais introduire une nouvelle dépendance** sans qu'elle soit déjà listée dans `ARCHITECTURE.md` ou explicitement validée par l'utilisateur.
- **Ne jamais casser l'isolation multi-tenant** — toute nouvelle requête Prisma doit filtrer par `tenantId`.
- **Ne jamais désactiver une vérification de sécurité** (RBAC, validation Zod, rate limiting) pour "faire avancer plus vite" une fonctionnalité.
- **Ne jamais utiliser Font Awesome, Bootstrap, ou une palette de couleurs hors de `DESIGN_SYSTEM.md`.**
- Si une demande contredit un de ces documents, le signaler explicitement avant d'exécuter, plutôt que d'appliquer silencieusement une interprétation.

## 3. Quand une information manque

Si une spec n'existe pas encore dans `PROJECT_KNOWLEDGE.md` pour une fonctionnalité demandée :
1. Proposer une définition cohérente avec l'existant
2. La faire valider par l'utilisateur
3. **L'ajouter au document** avant ou immédiatement après l'implémentation — la doc ne doit jamais prendre de retard sur le code

## 4. Style de code attendu

- TypeScript strict (`strict: true` dans `tsconfig.json`), pas de `any` sauf cas justifié en commentaire
- Server Components par défaut, `"use client"` seulement si nécessaire
- Noms de fichiers et composants en anglais, contenu utilisateur (UI texte) en français
- Un composant = une responsabilité ; extraire dès qu'un fichier dépasse ~200 lignes
- Commentaires uniquement là où l'intention n'est pas évidente par le code lui-même

## 5. Definition of Done pour une fonctionnalité

Une fonctionnalité n'est considérée terminée que si :
- [ ] Le RBAC et l'isolation tenant sont vérifiés
- [ ] Les entrées sont validées avec Zod
- [ ] Le rendu respecte le design system (pas de couleur/police hors charte)
- [ ] Les metadata SEO sont présentes si c'est une page publique
- [ ] Un test (unitaire ou E2E) minimal existe
- [ ] La documentation (`PROJECT_KNOWLEDGE.md`) est à jour si le comportement métier a changé

## 6. Ce qu'il ne faut jamais faire sans validation explicite de l'utilisateur

- Changer de stack technique ou de bibliothèque majeure
- Modifier le schéma de base de données de façon destructive
- Toucher à la logique de paiement ou de calcul des quotas d'abonnement
- Supprimer des fichiers de documentation existants

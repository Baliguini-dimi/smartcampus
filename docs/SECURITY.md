# SmartCampus — Règles de sécurité

> Ces règles sont non négociables. Toute Pull Request qui les enfreint est bloquée, quelle que soit l'urgence de la fonctionnalité.

## 1. Authentification

- Mots de passe hashés avec **bcrypt** (coût ≥ 12) ou **argon2**, jamais en clair, jamais en réversible
- Sessions gérées par NextAuth avec cookies **httpOnly, secure, sameSite=lax**
- Verrouillage progressif après tentatives échouées (rate limiting sur `/login`)
- Réinitialisation de mot de passe : token à usage unique, expiration courte (≤ 1h)
- Pas de compte de démo avec identifiants triviaux en production (`admin/admin`, etc.)

## 2. Autorisation (RBAC)

- **Toute vérification de rôle/permission se fait côté serveur**, jamais uniquement via l'affichage conditionnel côté client
- Chaque Server Action et Route Handler vérifie : (1) l'utilisateur est authentifié, (2) son rôle autorise l'action, (3) la ressource appartient bien à son tenant
- Principe du moindre privilège : un `professor` ne peut modifier que les notes de ses propres cours, un `student` ne peut lire que ses propres données

## 3. Isolation multi-tenant

- **Toute requête Prisma sur une table métier inclut `tenantId` dans le `where`**, sans exception
- Le `tenantId` courant provient de la session serveur, jamais d'un paramètre client non vérifié
- Tests automatisés dédiés à vérifier qu'un tenant A ne peut jamais accéder aux données d'un tenant B

## 4. Validation des entrées

- Toute donnée entrante (formulaire, API, webhook) validée par un schéma **Zod** côté serveur
- Aucune requête SQL construite par concaténation de chaînes — Prisma uniquement (protection injection SQL native)
- Upload de fichiers : validation du type MIME réel (pas seulement l'extension), taille limitée, stockage hors du dossier public exécutable

## 5. Protection des routes sensibles

- **Rate limiting** sur : login, inscription, reset password, appels IA, webhooks de paiement
- **CSRF** : géré nativement par NextAuth pour les formulaires ; vérification de signature pour les webhooks CinetPay
- Headers de sécurité (via middleware Next.js) : `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`

## 6. Secrets et configuration

- Toutes les clés (Groq, CinetPay, base de données, secret NextAuth) en **variables d'environnement**
- `.env` jamais commité — `.env.example` uniquement, sans valeurs réelles
- Rotation des secrets documentée pour la production
- Les logs ne doivent **jamais** contenir de mot de passe, token, ou numéro de carte/paiement complet

## 7. Paiement (CinetPay)

- Le montant à payer est **toujours recalculé côté serveur**, jamais fait confiance à une valeur envoyée par le client
- Vérification de signature/callback CinetPay obligatoire avant de marquer une facture payée
- Historique de paiement immuable (pas de suppression, uniquement des statuts)

## 8. Journalisation

- Toute action sensible (connexion, modification de note, paiement, changement de rôle) tracée dans `activity_logs` avec IP et user-agent
- Les logs sont consultables par l'admin du tenant concerné et le super admin uniquement

## 9. Dépendances

- Audit régulier (`npm audit` / Dependabot activé) — CI bloque sur vulnérabilité critique
- Mises à jour de sécurité appliquées rapidement, pas accumulées

## 10. Avant chaque déploiement en production

- [ ] `APP_DEBUG` / mode debug désactivé
- [ ] Aucun compte ou donnée de test dans la base de production
- [ ] HTTPS forcé (redirection automatique)
- [ ] Sauvegardes de base de données automatisées et testées (restauration vérifiée)
- [ ] Scan de vulnérabilités passé sans faille critique

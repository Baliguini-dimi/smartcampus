# SmartCampus — Design System

> Objectif : un rendu visuel qui inspire confiance à un DAF d'établissement scolaire ou à un investisseur — sobre, structuré, crédible. On évite tout ce qui "sent" un template généré rapidement : dégradés violets par défaut, emojis en guise d'icônes, ombres portées excessives, Bootstrap non personnalisé.

## 1. Fondation existante à conserver

Le projet original avait déjà une bonne intuition : bleu marine institutionnel + orange comme accent, typographies distinctives (Syne pour les titres, DM Sans pour le texte). On garde cette direction et on la structure en véritable design system.

## 2. Palette de couleurs

| Rôle | Couleur | Hex | Usage |
|---|---|---|---|
| Primaire (Navy) | Bleu marine profond | `#0B2B4F` | Fond hero, headers, boutons primaires, texte de marque |
| Primaire foncé | Navy nuit | `#071C36` | Hover, dégradés, footer |
| Accent | Ambre | `#FFB347` | CTA, badges, highlights, gamification |
| Accent foncé | Ambre brûlé | `#E8963F` | Hover sur accent |
| Neutre 900 | Anthracite | `#111827` | Texte principal |
| Neutre 600 | Gris ardoise | `#4B5563` | Texte secondaire |
| Neutre 200 | Gris clair | `#E5E7EB` | Bordures, séparateurs |
| Neutre 50 | Blanc cassé | `#F9FAFB` | Fond de page |
| Succès | Vert émeraude | `#10B981` | Confirmations, paiements validés |
| Alerte | Ambre rouge | `#F59E0B` | Avertissements |
| Erreur | Rouge | `#EF4444` | Erreurs, échéances dépassées |
| Info | Bleu ciel | `#3B82F6` | Informations neutres |

**Règle :** une seule couleur d'accent vive (l'ambre) — tout le reste reste sobre. Ne jamais utiliser plus de 2 couleurs saturées sur un même écran.

## 3. Typographie

| Usage | Police | Poids | Source |
|---|---|---|---|
| Titres (h1-h3) | **Syne** | 600–800 | Google Fonts |
| Corps de texte, UI | **DM Sans** | 400–500 | Google Fonts |
| Chiffres/tableaux (notes, finance) | **DM Sans** (tabular-nums) | 500 | idem, avec `font-variant-numeric: tabular-nums` |
| Code / données techniques | **JetBrains Mono** | 400 | Google Fonts (si besoin) |

Échelle typographique (base 16px, ratio 1.25) :
`text-xs 12px / text-sm 14px / text-base 16px / text-lg 18px / text-xl 20px / text-2xl 24px / text-3xl 30px / text-4xl 36px / text-5xl 48px`

**Règle de hiérarchie HTML :** un seul `<h1>` par page. Ne jamais sauter un niveau (`h1` → `h3` interdit sans `h2`).

## 4. Icônes

**Remplacer Font Awesome par Lucide Icons** (`lucide-react`) :
- Plus léger, tree-shakable, design cohérent et actuel
- Utilisé par shadcn/ui — cohérence garantie avec les composants
- Style trait fin, professionnel, non "cartoon"

Éviter les émojis dans l'interface applicative (acceptables uniquement dans le contexte gamification/badges, avec parcimonie).

## 5. Composants & bibliothèque UI

- **shadcn/ui** comme base (boutons, formulaires, dialogs, tables, tabs) — composants copiés dans le repo, donc personnalisables à 100%, pas de dépendance boîte noire
- **Tailwind CSS** pour tout le style, tokens de design définis dans `tailwind.config.ts` (pas de couleurs "magiques" en dur dans les composants)
- **Recharts** pour les graphiques analytiques (dashboards, statistiques de notes)
- Coins arrondis modérés (`rounded-lg` = 8px) — ni trop carré (froid) ni trop arrondi (infantilisant)
- Ombres subtiles uniquement (`shadow-sm` / `shadow-md`), jamais d'ombres colorées ou trop marquées

## 6. Ton visuel par espace

| Espace | Ambiance |
|---|---|
| Landing / marketing | Navy profond, dégradés discrets, grands titres Syne, preuve sociale, CTA ambre |
| Dashboard applicatif | Fond neutre clair, cartes blanches, données denses mais lisibles, navy pour la navigation |
| Espace étudiant (gamification) | Un peu plus de couleur/energie (badges, XP), mais sans casser la cohérence globale |
| Back-office Super Admin | Le plus sobre, orienté données, densité d'information maximale |

## 7. Ce qu'on évite explicitement

- Dégradés violet/rose par défaut (signature visuelle "generic AI SaaS")
- Icônes emoji en interface pro
- Polices système par défaut (Arial/Helvetica sans intention)
- Cartes avec ombre portée forte + coins très arrondis + dégradé (combo "template IA")
- Boutons avec trop d'effets (glow, animation excessive)
- Plus de 2 typographies dans le projet

## 8. Accessibilité

- Contraste minimum AA (4.5:1) sur tout texte
- Focus visible au clavier sur tous les éléments interactifs (géré par défaut via Radix/shadcn)
- Attributs `alt` obligatoires sur toutes les images
- Formulaires avec `label` associés (pas de placeholder-only)

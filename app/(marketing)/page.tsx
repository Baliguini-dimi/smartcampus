import Link from "next/link";
import {
  GraduationCap,
  Users,
  BarChart3,
  Sparkles,
  Wallet,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const modules = [
  {
    icon: Users,
    title: "Etudiants & professeurs",
    description:
      "Dossiers complets, filieres, statuts, inscriptions — un annuaire academique unique par etablissement.",
  },
  {
    icon: BarChart3,
    title: "Notes & presences",
    description:
      "Moyennes ponderees, mentions, rattrapages calcules automatiquement selon vos baremes.",
  },
  {
    icon: Sparkles,
    title: "IA pedagogique",
    description:
      "Generation de quiz et accompagnement des etudiants, avec quotas maitrises par plan.",
  },
  {
    icon: Wallet,
    title: "Finance & Mobile Money",
    description:
      "Facturation des frais de scolarite et paiement via Mobile Money, en FCFA natif.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero — nettement plus compact */}
      <section className="border-b border-neutral-200 bg-navy">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-2 md:py-16">
          <div>
            <p className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-amber">
              Pense pour les etablissements d&apos;Afrique francophone
            </p>
            <h1 className="font-heading text-3xl font-extrabold leading-tight text-white md:text-4xl">
              La gestion academique, sans le desordre de fin de semestre.
            </h1>
            <p className="mt-4 max-w-md text-base text-white/70">
              Etudiants, notes, presences, finances et IA pedagogique dans
              une seule plateforme, pensee pour grandir avec votre
              etablissement.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-md bg-amber px-5 py-2.5 text-sm font-medium text-navy-dark transition hover:bg-amber-dark"
              >
                Essayer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#modules"
                className="inline-flex items-center gap-2 rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Voir les modules
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <p className="font-heading text-sm font-bold text-navy">
                  Bulletin — Semestre 1
                </p>
                <p className="text-xs text-neutral-600">
                  Aicha Kone · L3 Informatique
                </p>
              </div>
              <GraduationCap className="h-5 w-5 text-navy" />
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-neutral-600">Algorithmique avancee</span>
                <span className="font-medium tabular-nums text-neutral-900">
                  16.5/20
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-neutral-600">Bases de donnees</span>
                <span className="font-medium tabular-nums text-neutral-900">
                  14/20
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-neutral-600">Reseaux & securite</span>
                <span className="font-medium tabular-nums text-neutral-900">
                  17/20
                </span>
              </li>
            </ul>
            <div className="mt-4 flex items-center justify-between rounded-md bg-neutral-50 px-3 py-2">
              <span className="text-xs font-medium text-neutral-600">
                Moyenne generale
              </span>
              <span className="rounded-full bg-amber/20 px-2 py-0.5 text-xs font-semibold text-amber-dark">
                15.83 · Mention Bien
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-heading text-2xl font-bold text-neutral-900 md:text-3xl">
          Tout ce qu&apos;un etablissement gere au quotidien
        </h2>
        <p className="mt-2 max-w-2xl text-neutral-600">
          Quatre piliers, une seule base de donnees, une isolation stricte
          entre etablissements.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <div
              key={m.title}
              className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <m.icon className="h-6 w-6 text-navy" />
              <h3 className="mt-4 font-heading text-base font-semibold text-neutral-900">
                {m.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600">{m.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Securite */}
      <section id="securite" className="border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-navy" />
            <div>
              <p className="font-heading font-semibold text-neutral-900">
                Isolation multi-tenant stricte
              </p>
              <p className="text-sm text-neutral-600">
                Chaque etablissement n&apos;accede qu&apos;a ses propres
                donnees, verifie cote serveur a chaque requete.
              </p>
            </div>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition hover:bg-navy-dark"
          >
            Creer mon etablissement
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

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
    title: "Étudiants & professeurs",
    description:
      "Dossiers complets, filières, statuts, inscriptions — un annuaire académique unique par établissement.",
  },
  {
    icon: BarChart3,
    title: "Notes & présences",
    description:
      "Moyennes pondérées, mentions, rattrapages calculés automatiquement selon vos barèmes.",
  },
  {
    icon: Sparkles,
    title: "IA pédagogique",
    description:
      "Génération de quiz et accompagnement des étudiants, avec quotas maîtrisés par plan.",
  },
  {
    icon: Wallet,
    title: "Finance & Mobile Money",
    description:
      "Facturation des frais de scolarité et paiement via Mobile Money, en FCFA natif.",
  },
];

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-heading text-xl font-bold text-navy">
            SmartCampus
          </span>
          <nav className="hidden items-center gap-8 text-sm text-neutral-600 md:flex">
            <Link href="#modules" className="hover:text-navy">
              Modules
            </Link>
            <Link href="#tarifs" className="hover:text-navy">
              Tarifs
            </Link>
            <Link href="/login" className="hover:text-navy">
              Connexion
            </Link>
          </nav>
          <Link
            href="/register"
            className="rounded-lg bg-amber px-4 py-2 text-sm font-medium text-navy-dark hover:bg-amber-dark"
          >
            Démarrer gratuitement
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-navy">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
            <div>
              <p className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-amber">
                Pensé pour les établissements d&apos;Afrique francophone
              </p>
              <h1 className="font-heading text-4xl font-extrabold leading-tight text-white md:text-5xl">
                La gestion académique, sans le désordre de fin de semestre.
              </h1>
              <p className="mt-6 max-w-md text-lg text-white/70">
                Étudiants, notes, présences, finances et IA pédagogique dans
                une seule plateforme — déployée en quelques minutes,
                pensée pour grandir avec votre établissement.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-amber px-6 py-3 font-medium text-navy-dark hover:bg-amber-dark"
                >
                  Essayer gratuitement
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#modules"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-medium text-white hover:bg-white/10"
                >
                  Voir les modules
                </Link>
              </div>
            </div>

            {/* Signature element: aperçu de bulletin */}
            <div className="relative mx-auto w-full max-w-sm rotate-2 rounded-xl bg-white p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-3">
                <div>
                  <p className="font-heading text-sm font-bold text-navy">
                    Bulletin — Semestre 1
                  </p>
                  <p className="text-xs text-neutral-600">
                    Aïcha Koné · L3 Informatique
                  </p>
                </div>
                <GraduationCap className="h-6 w-6 text-navy" />
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-neutral-600">
                    Algorithmique avancée
                  </span>
                  <span className="font-medium tabular-nums text-neutral-900">
                    16.5/20
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-neutral-600">Bases de données</span>
                  <span className="font-medium tabular-nums text-neutral-900">
                    14/20
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-neutral-600">
                    Réseaux & sécurité
                  </span>
                  <span className="font-medium tabular-nums text-neutral-900">
                    17/20
                  </span>
                </li>
              </ul>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                <span className="text-xs font-medium text-neutral-600">
                  Moyenne générale
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
          <h2 className="font-heading text-3xl font-bold text-neutral-900">
            Tout ce qu&apos;un établissement gère au quotidien
          </h2>
          <p className="mt-2 max-w-2xl text-neutral-600">
            Quatre piliers, une seule base de données, une isolation stricte
            entre établissements.
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
                <p className="mt-2 text-sm text-neutral-600">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Sécurité */}
        <section className="border-t border-neutral-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-16 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-navy" />
              <div>
                <p className="font-heading font-semibold text-neutral-900">
                  Isolation multi-tenant stricte
                </p>
                <p className="text-sm text-neutral-600">
                  Chaque établissement n&apos;accède qu&apos;à ses propres
                  données, vérifié côté serveur à chaque requête.
                </p>
              </div>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 font-medium text-white hover:bg-navy-dark"
            >
              Créer mon établissement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-neutral-600">
          © {new Date().getFullYear()} SmartCampus. Fait pour les
          établissements d&apos;Afrique francophone.
        </div>
      </footer>
    </>
  );
}

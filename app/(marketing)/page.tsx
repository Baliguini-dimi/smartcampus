import Link from "next/link";
import {
  Users,
  BarChart3,
  Sparkles,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Check,
} from "lucide-react";
import { DemoRequestForm } from "@/components/features/demo-request-form";

const modules = [
  {
    icon: Users,
    title: "Étudiants & enseignants",
    description:
      "Retrouvez toutes les informations de vos étudiants et de vos enseignants dans un espace unique. Gérez les inscriptions, les filières, les dossiers académiques et suivez chaque parcours en toute simplicité.",
  },
  {
    icon: BarChart3,
    title: "Notes & évaluations",
    description:
      "Calculez automatiquement les moyennes, gérez les évaluations, les rattrapages et publiez les résultats en quelques clics, sans calculs manuels.",
  },
  {
    icon: Sparkles,
    title: "Assistant pédagogique",
    description:
      "Créez des quiz, accompagnez les enseignants dans la préparation de leurs cours et proposez un meilleur suivi pédagogique grâce à des outils intelligents intégrés.",
  },
  {
    icon: Wallet,
    title: "Gestion financière",
    description:
      "Suivez les frais de scolarité, enregistrez les paiements, y compris par Mobile Money, et gardez une vision claire de la situation financière de votre établissement.",
  },
];

const plans = [
  {
    name: "Gratuit",
    price: "0 FCFA",
    description: "Pour démarrer sereinement, sans engagement.",
    features: ["50 étudiants", "10 cours", "5 enseignants", "Assistant pédagogique de base"],
  },
  {
    name: "Pro",
    price: "15 000 FCFA/mois",
    description: "Pour les établissements en pleine croissance.",
    features: ["500 étudiants", "100 cours", "Assistant pédagogique complet", "Annonces & présences"],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "35 000 FCFA/mois",
    description: "Pour les établissements qui veulent tout, sans limite.",
    features: ["Illimité", "Marque blanche", "Support prioritaire", "Portail parents"],
  },
];

const faqs = [
  {
    question: "Mes données sont-elles partagées avec d'autres établissements ?",
    answer:
      "Non, jamais. Chaque établissement dispose de son propre espace isolé, vérifié à chaque requête.",
  },
  {
    question: "Puis-je essayer avant de m'engager ?",
    answer:
      "Oui, l'offre Gratuite vous permet de découvrir la plateforme sans carte bancaire ni engagement.",
  },
  {
    question: "SmartCampus fonctionne-t-il avec le Mobile Money ?",
    answer:
      "Oui, les paiements de frais de scolarité sont pris en charge nativement en FCFA via Mobile Money.",
  },
  {
    question: "Que se passe-t-il si mon établissement grandit ?",
    answer:
      "Vous changez d'offre à tout moment, directement depuis votre espace, sans interruption de service.",
  },
];

function HeroDashboardPreview() {
  const stats = [
    { label: "Étudiants actifs", value: "482" },
    { label: "Taux de présence", value: "94%" },
    { label: "Moyenne générale", value: "13.7" },
  ];

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-white/10 bg-white shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-neutral-200 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
        <span className="ml-2 text-xs font-medium text-neutral-500">
          Tableau de bord — Établissement
        </span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg bg-neutral-50 p-3">
              <p className="font-heading text-xl font-bold text-navy">{s.value}</p>
              <p className="mt-1 text-[11px] leading-tight text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-neutral-200 p-4">
          <p className="mb-3 text-xs font-medium text-neutral-600">
            Répartition par filière
          </p>
          <div className="space-y-2">
            {[
              { label: "Informatique", pct: 80 },
              { label: "Gestion", pct: 55 },
              { label: "Droit", pct: 35 },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-[11px] text-neutral-500">
                  {row.label}
                </span>
                <div className="h-2 flex-1 rounded-full bg-neutral-100">
                  <div
                    className="h-2 rounded-full bg-amber"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* Hero - deux colonnes, apercu representatif */}
      <section className="border-b border-neutral-200 bg-navy">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-20">
          <div>
            <p className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-amber">
              Conçu pour les établissements d&apos;Afrique francophone
            </p>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-white md:text-5xl">
              La plateforme qui simplifie la gestion de votre établissement.
            </h1>
            <p className="mt-5 max-w-md text-base text-white/70 md:text-lg">
              Parce que votre temps est précieux, SmartCampus réunit les
              étudiants, les enseignants, les finances et toute la vie
              académique dans une seule plateforme, simple à utiliser et
              pensée pour accompagner le développement de votre établissement.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-md bg-amber px-5 py-2.5 text-sm font-medium text-navy-dark transition hover:bg-amber-dark"
              >
                Créer mon établissement
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#modules"
                className="inline-flex items-center gap-2 rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Découvrir la plateforme
              </Link>
            </div>
          </div>
          <HeroDashboardPreview />
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-bold text-neutral-900 md:text-3xl">
            Tout ce dont votre établissement a besoin, au même endroit.
          </h2>
          <p className="mt-2 text-neutral-600">
            De l&apos;inscription des étudiants jusqu&apos;à la gestion
            financière, SmartCampus vous accompagne au quotidien avec des
            outils simples, fiables et conçus pour faciliter le travail de vos
            équipes.
          </p>
        </div>
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
            <ShieldCheck className="h-8 w-8 shrink-0 text-navy" />
            <div>
              <p className="font-heading font-semibold text-neutral-900">
                Vos données restent exclusivement les vôtres.
              </p>
              <p className="text-sm text-neutral-600">
                Chaque établissement dispose de son propre espace sécurisé.
                Les données sont isolées et protégées afin de garantir leur
                confidentialité à chaque étape.
              </p>
            </div>
          </div>
          <Link
            href="/register"
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition hover:bg-navy-dark"
          >
            Créer mon établissement
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="border-t border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <h2 className="font-heading text-2xl font-bold text-neutral-900 md:text-3xl">
              Des tarifs adaptés à la taille de votre établissement.
            </h2>
            <p className="mt-2 text-neutral-600">
              Choisissez l&apos;offre qui correspond à vos besoins
              aujourd&apos;hui et faites évoluer votre plateforme au rythme de
              votre croissance.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border bg-white p-6 shadow-sm ${
                  plan.highlighted ? "border-amber ring-1 ring-amber" : "border-neutral-200"
                }`}
              >
                <p className="font-heading text-lg font-semibold text-neutral-900">
                  {plan.name}
                </p>
                <p className="mt-1 font-heading text-2xl font-bold text-navy">
                  {plan.price}
                </p>
                <p className="mt-2 text-sm text-neutral-600">{plan.description}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                      <Check className="h-4 w-4 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="border-t border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-center font-heading text-2xl font-bold text-neutral-900 md:text-3xl">
            Envie de voir SmartCampus en action ?
          </h2>
          <p className="mt-2 text-center text-neutral-600">
            Laissez-nous vos coordonnees, nous vous presentons la plateforme en direct.
          </p>
          <div className="mt-8">
            <DemoRequestForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="font-heading text-2xl font-bold text-neutral-900 md:text-3xl">
          Vous avez des questions ? Nous avons les réponses.
        </h2>
        <div className="mt-10 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b border-neutral-200 pb-6">
              <p className="font-heading font-semibold text-neutral-900">{faq.question}</p>
              <p className="mt-2 text-sm text-neutral-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t border-neutral-200 bg-navy">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
              Prêt à simplifier la gestion de votre établissement ?
            </h2>
            <p className="mt-3 text-white/70">
              Créez votre établissement en quelques minutes et découvrez une
              plateforme pensée pour vous accompagner durablement.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-amber px-6 py-3 text-sm font-medium text-navy-dark transition hover:bg-amber-dark"
          >
            Commencer gratuitement
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}



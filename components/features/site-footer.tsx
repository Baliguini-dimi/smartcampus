import Link from "next/link";

const columns = [
  {
    title: "Produit",
    links: [
      { label: "Fonctionnalités", href: "/#modules" },
      { label: "Tarifs", href: "/#tarifs" },
      { label: "Sécurité", href: "/#securite" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Centre d'aide", href: "#" },
      { label: "État des services", href: "#" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Politique de confidentialité", href: "#" },
      { label: "Conditions d'utilisation", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-navy-dark text-white/70">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <span className="font-heading text-lg font-bold text-white">
              SmartCampus
            </span>
            <p className="mt-3 text-sm">
              La plateforme qui accompagne les établissements d&apos;Afrique
              francophone dans leur gestion académique et administrative.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-white">{col.title}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-xs">
          © 2026 SmartCampus. Tous droits réservés. Conçu pour les
          établissements d&apos;Afrique francophone.
        </div>
      </div>
    </footer>
  );
}

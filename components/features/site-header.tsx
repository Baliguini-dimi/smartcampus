import Link from "next/link";
import { Logo } from "@/components/features/logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-neutral-600 md:flex">
          <Link href="/#Fonctionnalités" className="transition hover:text-navy">
            Fonctionnalités
          </Link>
          <Link href="/pricing" className="transition hover:text-navy">
            Tarifs
          </Link>
          <Link href="/login" className="transition hover:text-navy">
            Connexion
          </Link>
        </nav>
        <Link
          href="/register"
          className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white transition hover:bg-navy-dark"
        >
          Demarrer gratuitement
        </Link>
      </div>
    </header>
  );
}

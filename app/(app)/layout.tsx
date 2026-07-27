import Link from "next/link";
import { LayoutDashboard, Users } from "lucide-react";
import { getCurrentTenant } from "@/lib/tenant";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/students", label: "Etudiants", icon: Users },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, tenant } = await getCurrentTenant();

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="w-64 shrink-0 border-r border-neutral-200 bg-navy text-white">
        <div className="p-6">
          <p className="font-heading text-lg font-bold">SmartCampus</p>
          {tenant && (
            <p className="mt-1 text-xs text-white/60">{tenant.name}</p>
          )}
        </div>
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4 text-xs text-white/50">
          Connecte en tant que {session.user.role}
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}

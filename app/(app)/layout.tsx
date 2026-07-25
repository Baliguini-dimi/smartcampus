import { getCurrentTenant } from "@/lib/tenant";

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
        <nav className="px-4 text-sm text-white/80">
          <p className="px-2 py-2">{session.user.role}</p>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
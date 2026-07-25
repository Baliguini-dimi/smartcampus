import { requireSession } from "@/lib/auth-guards";

export default async function DashboardPage() {
  const session = await requireSession();

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <h1 className="font-heading text-2xl font-bold text-navy">
          Bienvenue, {session.user.name}
        </h1>
        <p className="mt-2 text-neutral-600">
          Role : <span className="font-medium">{session.user.role}</span>
        </p>
      </div>
    </main>
  );
}

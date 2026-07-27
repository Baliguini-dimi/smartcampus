import Link from "next/link";
import { UserPlus } from "lucide-react";
import { getCurrentTenant } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string; level?: string; status?: string }>;
}) {
  const { tenant } = await getCurrentTenant();
  const params = await searchParams;

  if (!tenant) {
    return <p className="p-8 text-neutral-600">Aucun etablissement associe.</p>;
  }

  const students = await prisma.student.findMany({
    where: {
      tenantId: tenant.id,
      ...(params.department ? { department: params.department } : {}),
      ...(params.level ? { level: params.level } : {}),
      ...(params.status ? { status: params.status as "active" } : {}),
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">Etudiants</h1>
          <p className="mt-1 text-sm text-neutral-600">
            {students.length} etudiant{students.length > 1 ? "s" : ""} inscrit
            {students.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/students/new"
          className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark"
        >
          <UserPlus className="h-4 w-4" />
          Ajouter un etudiant
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Matricule</th>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Filiere</th>
              <th className="px-4 py-3">Niveau</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  Aucun etudiant pour l&apos;instant.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 font-medium tabular-nums text-neutral-900">
                    {s.matricule}
                  </td>
                  <td className="px-4 py-3 text-neutral-900">
                    {s.user.firstName} {s.user.lastName}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{s.user.email}</td>
                  <td className="px-4 py-3 text-neutral-600">{s.fieldOfStudy ?? "-"}</td>
                  <td className="px-4 py-3 text-neutral-600">{s.level ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

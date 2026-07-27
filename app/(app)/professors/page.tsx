import Link from "next/link";
import { UserPlus, Pencil } from "lucide-react";
import { getCurrentTenant } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { DeleteProfessorButton } from "@/components/features/delete-professor-button";

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  on_leave: "Conge",
  retired: "Retraite",
  terminated: "Termine",
};

export default async function ProfessorsPage() {
  const { tenant } = await getCurrentTenant();

  if (!tenant) {
    return <p className="p-8 text-neutral-600">Aucun etablissement associe.</p>;
  }

  const professors = await prisma.professor.findMany({
    where: { tenantId: tenant.id },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">Professeurs</h1>
          <p className="mt-1 text-sm text-neutral-600">
            {professors.length} professeur{professors.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/professors/new"
          className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark"
        >
          <UserPlus className="h-4 w-4" />
          Ajouter un professeur
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Matricule</th>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Departement</th>
              <th className="px-4 py-3">Specialisation</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {professors.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                  Aucun professeur pour l&apos;instant.
                </td>
              </tr>
            ) : (
              professors.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 font-medium tabular-nums text-neutral-900">
                    {p.employeeId}
                  </td>
                  <td className="px-4 py-3 text-neutral-900">
                    {p.user.firstName} {p.user.lastName}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{p.user.email}</td>
                  <td className="px-4 py-3 text-neutral-600">{p.department ?? "-"}</td>
                  <td className="px-4 py-3 text-neutral-600">{p.specialization ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      {STATUS_LABELS[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/professors/${p.id}/edit`}
                        className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-navy"
                        aria-label="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteProfessorButton
                        professorId={p.id}
                        professorName={`${p.user.firstName} ${p.user.lastName}`}
                      />
                    </div>
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
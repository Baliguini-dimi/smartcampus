import Link from "next/link";
import { UserPlus, Pencil } from "lucide-react";
import { getCurrentTenant } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { DeleteStudentButton } from "@/components/features/delete-student-button";

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  suspended: "Suspendu",
  graduated: "Diplome",
  dropped: "Abandon",
  on_leave: "Conge",
};

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string }>;
}) {
  const { tenant } = await getCurrentTenant();
  const params = await searchParams;

  if (!tenant) {
    return <p className="p-8 text-neutral-600">Aucun etablissement associe.</p>;
  }

  const [students, departmentRows] = await Promise.all([
    prisma.student.findMany({
      where: {
        tenantId: tenant.id,
        ...(params.department ? { department: params.department } : {}),
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.student.findMany({
      where: { tenantId: tenant.id, department: { not: null } },
      select: { department: true },
      distinct: ["department"],
    }),
  ]);

  const departments = departmentRows
    .map((d) => d.department)
    .filter((d): d is string => Boolean(d));

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

      {departments.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/students"
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              !params.department ? "bg-navy text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Tous
          </Link>
          {departments.map((dept) => (
            <Link
              key={dept}
              href={`/students?department=${encodeURIComponent(dept)}`}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                params.department === dept ? "bg-navy text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {dept}
            </Link>
          ))}
        </div>
      )}

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
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
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
                      {STATUS_LABELS[s.status] ?? s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/students/${s.id}/edit`}
                        className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-navy"
                        aria-label="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteStudentButton
                        studentId={s.id}
                        studentName={`${s.user.firstName} ${s.user.lastName}`}
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
import Link from "next/link";
import { BookPlus, Pencil, Users } from "lucide-react";
import { getCurrentTenant } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { DeleteCourseButton } from "@/components/features/delete-course-button";

export default async function CoursesPage() {
  const { tenant } = await getCurrentTenant();

  if (!tenant) {
    return <p className="p-8 text-neutral-600">Aucun etablissement associe.</p>;
  }

  const courses = await prisma.course.findMany({
    where: { tenantId: tenant.id },
    include: { professor: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">Cours</h1>
          <p className="mt-1 text-sm text-neutral-600">
            {courses.length} cours
          </p>
        </div>
        <Link
          href="/courses/new"
          className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark"
        >
          <BookPlus className="h-4 w-4" />
          Ajouter un cours
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Credits</th>
              <th className="px-4 py-3">Professeur</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                  Aucun cours pour l&apos;instant.
                </td>
              </tr>
            ) : (
              courses.map((c) => (
                <tr key={c.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 font-medium tabular-nums text-neutral-900">{c.code}</td>
                  <td className="px-4 py-3 text-neutral-900">{c.title}</td>
                  <td className="px-4 py-3 text-neutral-600">{c.type}</td>
                  <td className="px-4 py-3 tabular-nums text-neutral-600">{c.credits.toString()}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {c.professor ? `${c.professor.user.firstName} ${c.professor.user.lastName}` : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/courses/${c.id}/edit`}
                        className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-navy"
                        aria-label="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/courses/${c.id}/enrollments`}
                        className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-navy"
                        aria-label="Voir les inscrits"
                      >
                        <Users className="h-4 w-4" />
                      </Link>
                      <DeleteCourseButton courseId={c.id} courseName={`${c.code} - ${c.title}`} />
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
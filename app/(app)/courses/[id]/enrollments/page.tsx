import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentTenant } from "@/lib/tenant";
import { AddEnrollmentForm } from "@/components/features/add-enrollment-form";
import { EnrollmentRowActions } from "@/components/features/enrollment-row-actions";

const STATUS_LABELS: Record<string, string> = {
  enrolled: "Inscrit",
  completed: "Termine",
  failed: "Echoue",
  dropped: "Abandon",
};

export default async function CourseEnrollmentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { tenant } = await getCurrentTenant();
  if (!tenant) notFound();

  const course = await prisma.course.findFirst({
    where: { id: Number(id), tenantId: tenant.id },
  });
  if (!course) notFound();

  const [enrollments, allStudents] = await Promise.all([
    prisma.enrollment.findMany({
      where: { courseId: course.id },
      include: { student: { include: { user: true } } },
      orderBy: { enrolledAt: "desc" },
    }),
    prisma.student.findMany({
      where: { tenantId: tenant.id },
      include: { user: true },
    }),
  ]);

  const enrolledStudentIds = new Set(enrollments.map((e) => e.studentId));
  const availableStudents = allStudents
    .filter((s) => !enrolledStudentIds.has(s.id))
    .map((s) => ({ id: s.id, name: `${s.user.firstName} ${s.user.lastName}`, matricule: s.matricule }));

  return (
    <div className="p-8">
      <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-navy">
        <ArrowLeft className="h-4 w-4" />
        Retour aux cours
      </Link>

      <h1 className="mt-4 font-heading text-2xl font-bold text-neutral-900">
        Inscriptions — {course.code} {course.title}
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        {enrollments.length} / {course.capacity} places occupees
      </p>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-4">
        <AddEnrollmentForm courseId={course.id} availableStudents={availableStudents} />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Matricule</th>
              <th className="px-4 py-3">Etudiant</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                  Aucun etudiant inscrit pour l&apos;instant.
                </td>
              </tr>
            ) : (
              enrollments.map((e) => (
                <tr key={e.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 font-medium tabular-nums text-neutral-900">
                    {e.student.matricule}
                  </td>
                  <td className="px-4 py-3 text-neutral-900">
                    {e.student.user.firstName} {e.student.user.lastName}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      {STATUS_LABELS[e.status] ?? e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <EnrollmentRowActions
                      enrollmentId={e.id}
                      status={e.status}
                      studentName={`${e.student.user.firstName} ${e.student.user.lastName}`}
                    />
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
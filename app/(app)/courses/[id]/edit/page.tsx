import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentTenant } from "@/lib/tenant";
import { EditCourseForm } from "@/components/features/edit-course-form";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { tenant } = await getCurrentTenant();

  if (!tenant) notFound();

  const [course, professors] = await Promise.all([
    prisma.course.findFirst({ where: { id: Number(id), tenantId: tenant.id } }),
    prisma.professor.findMany({
      where: { tenantId: tenant.id, status: "active" },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!course) notFound();

  return (
    <div className="p-8">
      <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-navy">
        <ArrowLeft className="h-4 w-4" />
        Retour a la liste
      </Link>

      <h1 className="mt-4 font-heading text-2xl font-bold text-neutral-900">
        Modifier {course.code} - {course.title}
      </h1>

      <EditCourseForm
        courseId={course.id}
        professors={professors.map((p) => ({ id: p.id, name: `${p.user.firstName} ${p.user.lastName}` }))}
        defaultValues={{
          code: course.code,
          title: course.title,
          description: course.description ?? "",
          department: course.department ?? "",
          level: course.level ?? "",
          credits: course.credits.toString(),
          coefficient: course.coefficient.toString(),
          capacity: course.capacity,
          semester: course.semester,
          academicYear: course.academicYear ?? "",
          type: course.type,
          professorId: course.professorId ?? "",
          status: course.status,
        }}
      />
    </div>
  );
}
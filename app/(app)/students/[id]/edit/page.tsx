import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentTenant } from "@/lib/tenant";
import { EditStudentForm } from "@/components/features/edit-student-form";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { tenant } = await getCurrentTenant();

  if (!tenant) notFound();

  const student = await prisma.student.findFirst({
    where: { id: Number(id), tenantId: tenant.id },
    include: { user: true },
  });

  if (!student) notFound();

  return (
    <div className="p-8">
      <Link
        href="/students"
        className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour a la liste
      </Link>

      <h1 className="mt-4 font-heading text-2xl font-bold text-neutral-900">
        Modifier {student.user.firstName} {student.user.lastName}
      </h1>

      <EditStudentForm
        studentId={student.id}
        defaultValues={{
          firstName: student.user.firstName,
          lastName: student.user.lastName,
          email: student.user.email,
          matricule: student.matricule,
          department: student.department ?? "",
          fieldOfStudy: student.fieldOfStudy ?? "",
          level: student.level ?? "",
          academicYear: student.academicYear ?? "",
          status: student.status,
        }}
      />
    </div>
  );
}
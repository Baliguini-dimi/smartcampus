import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentTenant } from "@/lib/tenant";
import { EditProfessorForm } from "@/components/features/edit-professor-form";

export default async function EditProfessorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { tenant } = await getCurrentTenant();

  if (!tenant) notFound();

  const professor = await prisma.professor.findFirst({
    where: { id: Number(id), tenantId: tenant.id },
    include: { user: true },
  });

  if (!professor) notFound();

  return (
    <div className="p-8">
      <Link href="/professors" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-navy">
        <ArrowLeft className="h-4 w-4" />
        Retour a la liste
      </Link>

      <h1 className="mt-4 font-heading text-2xl font-bold text-neutral-900">
        Modifier {professor.user.firstName} {professor.user.lastName}
      </h1>

      <EditProfessorForm
        professorId={professor.id}
        defaultValues={{
          firstName: professor.user.firstName,
          lastName: professor.user.lastName,
          email: professor.user.email,
          employeeId: professor.employeeId,
          department: professor.department ?? "",
          specialization: professor.specialization ?? "",
          qualification: professor.qualification ?? "",
          officeLocation: professor.officeLocation ?? "",
          status: professor.status,
        }}
      />
    </div>
  );
}
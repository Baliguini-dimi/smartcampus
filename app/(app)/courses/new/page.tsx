import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentTenant } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { NewCourseForm } from "@/components/features/new-course-form";

export default async function NewCoursePage() {
  const { tenant } = await getCurrentTenant();
  if (!tenant) {
    return <p className="p-8 text-neutral-600">Aucun etablissement associe.</p>;
  }

  const professors = await prisma.professor.findMany({
    where: { tenantId: tenant.id, status: "active" },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-navy">
        <ArrowLeft className="h-4 w-4" />
        Retour a la liste
      </Link>

      <h1 className="mt-4 font-heading text-2xl font-bold text-neutral-900">Ajouter un cours</h1>

      <NewCourseForm
        professors={professors.map((p) => ({
          id: p.id,
          name: `${p.user.firstName} ${p.user.lastName}`,
        }))}
      />
    </div>
  );
}
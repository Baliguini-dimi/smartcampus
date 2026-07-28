"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createEnrollmentSchema, updateEnrollmentStatusSchema } from "@/lib/validations/enrollment";
import { requireRole } from "@/lib/auth-guards";
import { Prisma } from "@/app/generated/prisma/client";

export type EnrollmentFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createEnrollment(
  _prevState: EnrollmentFormState,
  formData: FormData
): Promise<EnrollmentFormState> {
  const session = await requireRole(["admin"]);
  const tenantId = session.user.tenantId;
  if (!tenantId) {
    return { error: "Aucun etablissement associe a ce compte." };
  }

  const parsed = createEnrollmentSchema.safeParse({
    studentId: formData.get("studentId"),
    courseId: formData.get("courseId"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const { studentId, courseId } = parsed.data;

  // Isolation tenant : verifier que l'etudiant ET le cours appartiennent bien au tenant courant.
  const [student, course] = await Promise.all([
    prisma.student.findFirst({ where: { id: studentId, tenantId } }),
    prisma.course.findFirst({
      where: { id: courseId, tenantId },
      include: { _count: { select: { enrollments: true } } },
    }),
  ]);

  if (!student || !course) {
    return { error: "Etudiant ou cours introuvable." };
  }

  if (course._count.enrollments >= course.capacity) {
    return { error: "Ce cours a atteint sa capacite maximale." };
  }

  try {
    await prisma.enrollment.create({
      data: { tenantId, studentId, courseId, status: "enrolled" },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "Cet etudiant est deja inscrit a ce cours." };
    }
    console.error("createEnrollment error:", e);
    return { error: "Une erreur est survenue, reessayez dans un instant." };
  }

  revalidatePath(`/courses/${courseId}/enrollments`);
  return {};
}

export async function updateEnrollmentStatus(
  enrollmentId: number,
  status: string
): Promise<{ error?: string }> {
  const session = await requireRole(["admin"]);
  const tenantId = session.user.tenantId;
  if (!tenantId) {
    return { error: "Aucun etablissement associe a ce compte." };
  }

  const parsed = updateEnrollmentStatusSchema.safeParse({ status });
  if (!parsed.success) {
    return { error: "Statut invalide." };
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { id: enrollmentId, tenantId },
  });
  if (!enrollment) {
    return { error: "Inscription introuvable." };
  }

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status: parsed.data.status },
  });

  revalidatePath(`/courses/${enrollment.courseId}/enrollments`);
  return {};
}

export async function deleteEnrollment(enrollmentId: number): Promise<{ error?: string }> {
  const session = await requireRole(["admin"]);
  const tenantId = session.user.tenantId;
  if (!tenantId) {
    return { error: "Aucun etablissement associe a ce compte." };
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { id: enrollmentId, tenantId },
  });
  if (!enrollment) {
    return { error: "Inscription introuvable." };
  }

  await prisma.enrollment.delete({ where: { id: enrollmentId } });

  revalidatePath(`/courses/${enrollment.courseId}/enrollments`);
  return {};
}
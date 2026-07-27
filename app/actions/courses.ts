"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createCourseSchema, updateCourseSchema } from "@/lib/validations/course";
import { requireRole } from "@/lib/auth-guards";
import { Prisma } from "@/app/generated/prisma/client";

export type CourseFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseCourseFormData(formData: FormData) {
  return {
    code: formData.get("code"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    department: formData.get("department") || undefined,
    level: formData.get("level") || undefined,
    credits: formData.get("credits") || undefined,
    coefficient: formData.get("coefficient") || undefined,
    capacity: formData.get("capacity") || undefined,
    semester: formData.get("semester") || undefined,
    academicYear: formData.get("academicYear") || undefined,
    type: formData.get("type") || undefined,
    professorId: formData.get("professorId") || undefined,
  };
}

export async function createCourse(
  _prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  const session = await requireRole(["admin"]);
  const tenantId = session.user.tenantId;
  if (!tenantId) {
    return { error: "Aucun etablissement associe a ce compte." };
  }

  const parsed = createCourseSchema.safeParse(parseCourseFormData(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  try {
    await prisma.course.create({
      data: { ...parsed.data, tenantId, status: "active" },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { fieldErrors: { code: "Ce code de cours existe deja pour cette annee academique." } };
    }
    console.error("createCourse error:", e);
    return { error: "Une erreur est survenue, reessayez dans un instant." };
  }

  revalidatePath("/courses");
  return {};
}

export async function updateCourse(
  courseId: number,
  _prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  const session = await requireRole(["admin"]);
  const tenantId = session.user.tenantId;
  if (!tenantId) {
    return { error: "Aucun etablissement associe a ce compte." };
  }

  const parsed = updateCourseSchema.safeParse({
    ...parseCourseFormData(formData),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const course = await prisma.course.findFirst({ where: { id: courseId, tenantId } });
  if (!course) {
    return { error: "Cours introuvable." };
  }

  try {
    await prisma.course.update({ where: { id: courseId }, data: parsed.data });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { fieldErrors: { code: "Ce code de cours existe deja pour cette annee academique." } };
    }
    console.error("updateCourse error:", e);
    return { error: "Une erreur est survenue, reessayez dans un instant." };
  }

  revalidatePath("/courses");
  return {};
}

export async function deleteCourse(courseId: number): Promise<{ error?: string }> {
  const session = await requireRole(["admin"]);
  const tenantId = session.user.tenantId;
  if (!tenantId) {
    return { error: "Aucun etablissement associe a ce compte." };
  }

  const course = await prisma.course.findFirst({ where: { id: courseId, tenantId } });
  if (!course) {
    return { error: "Cours introuvable." };
  }

  await prisma.course.delete({ where: { id: courseId } });

  revalidatePath("/courses");
  return {};
}
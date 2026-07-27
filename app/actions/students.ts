"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createStudentSchema, updateStudentSchema } from "@/lib/validations/student";
import { requireRole } from "@/lib/auth-guards";
import { Prisma } from "@/app/generated/prisma/client";

export type CreateStudentState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createStudent(
  _prevState: CreateStudentState,
  formData: FormData
): Promise<CreateStudentState> {
  const session = await requireRole(["admin"]);
  const tenantId = session.user.tenantId;
  if (!tenantId) {
    return { error: "Aucun etablissement associe a ce compte." };
  }

  const parsed = createStudentSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    matricule: formData.get("matricule"),
    department: formData.get("department") || undefined,
    fieldOfStudy: formData.get("fieldOfStudy") || undefined,
    level: formData.get("level") || undefined,
    academicYear: formData.get("academicYear") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const data = parsed.data;
  const passwordHash = await hashPassword(data.password);

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          tenantId,
          email: data.email,
          password: passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          role: "student",
          status: "active",
        },
      });

      await tx.student.create({
        data: {
          tenantId,
          userId: user.id,
          matricule: data.matricule,
          department: data.department,
          fieldOfStudy: data.fieldOfStudy,
          level: data.level,
          academicYear: data.academicYear,
          status: "active",
        },
      });
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return {
        fieldErrors: {
          email: "Cet email ou ce matricule est deja utilise dans votre etablissement.",
        },
      };
    }
    console.error("createStudent error:", e);
    return { error: "Une erreur est survenue, reessayez dans un instant." };
  }

  revalidatePath("/students");
  return {};
}

export type UpdateStudentState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function updateStudent(
  studentId: number,
  _prevState: UpdateStudentState,
  formData: FormData
): Promise<UpdateStudentState> {
  const session = await requireRole(["admin"]);
  const tenantId = session.user.tenantId;
  if (!tenantId) {
    return { error: "Aucun etablissement associe a ce compte." };
  }

  const parsed = updateStudentSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    matricule: formData.get("matricule"),
    department: formData.get("department") || undefined,
    fieldOfStudy: formData.get("fieldOfStudy") || undefined,
    level: formData.get("level") || undefined,
    academicYear: formData.get("academicYear") || undefined,
    status: formData.get("status"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  // Isolation tenant : on ne modifie que si le student appartient bien au tenant courant.
  const student = await prisma.student.findFirst({
    where: { id: studentId, tenantId },
  });
  if (!student) {
    return { error: "Etudiant introuvable." };
  }

  const data = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: student.userId },
        data: { firstName: data.firstName, lastName: data.lastName, email: data.email },
      });
      await tx.student.update({
        where: { id: studentId },
        data: {
          matricule: data.matricule,
          department: data.department,
          fieldOfStudy: data.fieldOfStudy,
          level: data.level,
          academicYear: data.academicYear,
          status: data.status,
        },
      });
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { fieldErrors: { email: "Cet email ou ce matricule est deja utilise." } };
    }
    console.error("updateStudent error:", e);
    return { error: "Une erreur est survenue, reessayez dans un instant." };
  }

  revalidatePath("/students");
  return {};
}

export async function deleteStudent(studentId: number): Promise<{ error?: string }> {
  const session = await requireRole(["admin"]);
  const tenantId = session.user.tenantId;
  if (!tenantId) {
    return { error: "Aucun etablissement associe a ce compte." };
  }

  // Isolation tenant : on ne supprime que si le student appartient bien au tenant courant.
  const student = await prisma.student.findFirst({
    where: { id: studentId, tenantId },
  });
  if (!student) {
    return { error: "Etudiant introuvable." };
  }

  // Supprimer le User cascade automatiquement vers Student (onDelete: Cascade dans le schema).
  await prisma.user.delete({ where: { id: student.userId } });

  revalidatePath("/students");
  return {};
}


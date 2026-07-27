"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createProfessorSchema, updateProfessorSchema } from "@/lib/validations/professor";
import { requireRole } from "@/lib/auth-guards";
import { Prisma } from "@/app/generated/prisma/client";

export type CreateProfessorState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createProfessor(
  _prevState: CreateProfessorState,
  formData: FormData
): Promise<CreateProfessorState> {
  const session = await requireRole(["admin"]);
  const tenantId = session.user.tenantId;
  if (!tenantId) {
    return { error: "Aucun etablissement associe a ce compte." };
  }

  const parsed = createProfessorSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    employeeId: formData.get("employeeId"),
    department: formData.get("department") || undefined,
    specialization: formData.get("specialization") || undefined,
    qualification: formData.get("qualification") || undefined,
    officeLocation: formData.get("officeLocation") || undefined,
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
          role: "professor",
          status: "active",
        },
      });

      await tx.professor.create({
        data: {
          tenantId,
          userId: user.id,
          employeeId: data.employeeId,
          department: data.department,
          specialization: data.specialization,
          qualification: data.qualification,
          officeLocation: data.officeLocation,
          status: "active",
        },
      });
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return {
        fieldErrors: {
          email: "Cet email ou ce matricule employe est deja utilise dans votre etablissement.",
        },
      };
    }
    console.error("createProfessor error:", e);
    return { error: "Une erreur est survenue, reessayez dans un instant." };
  }

  revalidatePath("/professors");
  return {};
}

export type UpdateProfessorState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function updateProfessor(
  professorId: number,
  _prevState: UpdateProfessorState,
  formData: FormData
): Promise<UpdateProfessorState> {
  const session = await requireRole(["admin"]);
  const tenantId = session.user.tenantId;
  if (!tenantId) {
    return { error: "Aucun etablissement associe a ce compte." };
  }

  const parsed = updateProfessorSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    employeeId: formData.get("employeeId"),
    department: formData.get("department") || undefined,
    specialization: formData.get("specialization") || undefined,
    qualification: formData.get("qualification") || undefined,
    officeLocation: formData.get("officeLocation") || undefined,
    status: formData.get("status"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const professor = await prisma.professor.findFirst({
    where: { id: professorId, tenantId },
  });
  if (!professor) {
    return { error: "Professeur introuvable." };
  }

  const data = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: professor.userId },
        data: { firstName: data.firstName, lastName: data.lastName, email: data.email },
      });
      await tx.professor.update({
        where: { id: professorId },
        data: {
          employeeId: data.employeeId,
          department: data.department,
          specialization: data.specialization,
          qualification: data.qualification,
          officeLocation: data.officeLocation,
          status: data.status,
        },
      });
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { fieldErrors: { email: "Cet email ou ce matricule est deja utilise." } };
    }
    console.error("updateProfessor error:", e);
    return { error: "Une erreur est survenue, reessayez dans un instant." };
  }

  revalidatePath("/professors");
  return {};
}

export async function deleteProfessor(professorId: number): Promise<{ error?: string }> {
  const session = await requireRole(["admin"]);
  const tenantId = session.user.tenantId;
  if (!tenantId) {
    return { error: "Aucun etablissement associe a ce compte." };
  }

  const professor = await prisma.professor.findFirst({
    where: { id: professorId, tenantId },
  });
  if (!professor) {
    return { error: "Professeur introuvable." };
  }

  await prisma.user.delete({ where: { id: professor.userId } });

  revalidatePath("/professors");
  return {};
}
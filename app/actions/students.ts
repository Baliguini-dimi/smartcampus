"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createStudentSchema } from "@/lib/validations/student";
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

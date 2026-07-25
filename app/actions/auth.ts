"use server";

import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { registerSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth";
import { generateResetToken, hashToken } from "@/lib/tokens";
import { signIn } from "@/auth";

export type RegisterState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function registerTenant(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const raw = {
    tenantName: formData.get("tenantName"),
    tenantSlug: formData.get("tenantSlug"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const data = parsed.data;

  const existingSlug = await prisma.tenant.findUnique({
    where: { slug: data.tenantSlug },
  });
  if (existingSlug) {
    return { fieldErrors: { tenantSlug: "Cet identifiant est deja pris" } };
  }

  const freePlan = await prisma.plan.findFirst({ where: { name: "free" } });
  if (!freePlan) {
    return { error: "Configuration serveur invalide (plan gratuit introuvable)." };
  }

  const passwordHash = await hashPassword(data.password);

  try {
    await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: data.tenantName,
          slug: data.tenantSlug,
          email: data.email,
          planId: freePlan.id,
          status: "trial",
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      });

      await tx.user.create({
        data: {
          tenantId: tenant.id,
          email: data.email,
          password: passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          role: "admin",
          status: "active",
        },
      });
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return {
        fieldErrors: {
          email: "Cet email est deja utilise par un autre etablissement.",
        },
      };
    }
    console.error("registerTenant error:", e);
    return { error: "Une erreur est survenue, reessayez dans un instant." };
  }

  await signIn("credentials", {
    email: data.email,
    password: data.password,
    redirect: false,
  });

  return {};
}

export type ForgotPasswordState = {
  submitted?: boolean;
  fieldErrors?: Record<string, string>;
};

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { fieldErrors: { email: "Email invalide" } };
  }

  const user = await prisma.user.findFirst({
    where: { email: parsed.data.email, status: "active" },
  });

  if (user) {
    const { rawToken, hashedToken, expiresAt } = generateResetToken();

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hashedToken, resetExpiresAt: expiresAt },
    });

    console.log(
      `[DEV] Lien de reinitialisation pour ${user.email} : /reset-password?token=${rawToken}`
    );
  }

  return { submitted: true };
}

export type ResetPasswordState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const hashedToken = hashToken(parsed.data.token);

  const user = await prisma.user.findFirst({
    where: {
      resetToken: hashedToken,
      resetExpiresAt: { gt: new Date() },
    },
  });

  if (!user) {
    return { error: "Ce lien de reinitialisation est invalide ou a expire." };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: passwordHash,
      resetToken: null,
      resetExpiresAt: null,
    },
  });

  return { success: true };
}

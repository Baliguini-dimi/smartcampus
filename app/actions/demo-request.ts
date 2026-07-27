"use server";

import { prisma } from "@/lib/prisma";
import { demoRequestSchema } from "@/lib/validations/auth";

export type DemoRequestState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitDemoRequest(
  _prevState: DemoRequestState,
  formData: FormData
): Promise<DemoRequestState> {
  const parsed = demoRequestSchema.safeParse({
    institutionName: formData.get("institutionName"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  await prisma.demoRequest.create({ data: parsed.data });

  // TODO Phase 4 : notifier l'equipe par email via Resend au lieu du simple log.
  console.log(`[DEV] Nouvelle demande de demo : ${parsed.data.institutionName} (${parsed.data.email})`);

  return { success: true };
}

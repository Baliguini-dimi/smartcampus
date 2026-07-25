import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-guards";

/**
 * Recupere le tenant de l'utilisateur connecte.
 * Le super_admin n'a pas de tenant (tenantId = null) â€” a gerer a part
 * dans les pages du back-office (Phase 7).
 */
export async function getCurrentTenant() {
  const session = await requireSession();

  if (session.user.role === "super_admin") {
    return { session, tenant: null };
  }

  if (!session.user.tenantId) {
    redirect("/login");
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
  });

  if (!tenant || tenant.status === "suspended" || tenant.status === "cancelled") {
    redirect("/login");
  }

  return { session, tenant };
}

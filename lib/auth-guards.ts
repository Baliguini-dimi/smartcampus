import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Role } from "@/lib/permissions";

/** Exige une session valide, sinon redirige vers /login. A utiliser dans les Server Components. */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

/** Exige un role precis, sinon redirige. A utiliser au debut d'une Server Action ou d'une page. */
export async function requireRole(allowed: Role[]) {
  const session = await requireSession();
  if (!allowed.includes(session.user.role as Role)) {
    redirect("/dashboard");
  }
  return session;
}

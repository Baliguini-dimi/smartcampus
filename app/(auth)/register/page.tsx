"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { registerTenant, type RegisterState } from "@/app/actions/auth";

const initialState: RegisterState = {};

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(registerTenant, initialState);

  useEffect(() => {
    if (!state.error && !state.fieldErrors && state !== initialState) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="font-heading text-2xl font-bold text-navy">
          Creer mon etablissement
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          14 jours d&apos;essai, sans carte bancaire.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900">
              Nom de l&apos;etablissement
            </label>
            <input
              name="tenantName"
              required
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
            />
            {state.fieldErrors?.tenantName && (
              <p className="mt-1 text-xs text-error">{state.fieldErrors.tenantName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900">
              Identifiant (sous-domaine)
            </label>
            <input
              name="tenantSlug"
              required
              placeholder="mon-etablissement"
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
            />
            {state.fieldErrors?.tenantSlug && (
              <p className="mt-1 text-xs text-error">{state.fieldErrors.tenantSlug}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-neutral-900">Prenom</label>
              <input
                name="firstName"
                required
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
              />
              {state.fieldErrors?.firstName && (
                <p className="mt-1 text-xs text-error">{state.fieldErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900">Nom</label>
              <input
                name="lastName"
                required
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
              />
              {state.fieldErrors?.lastName && (
                <p className="mt-1 text-xs text-error">{state.fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
            />
            {state.fieldErrors?.email && (
              <p className="mt-1 text-xs text-error">{state.fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900">
              Mot de passe
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
            />
            {state.fieldErrors?.password && (
              <p className="mt-1 text-xs text-error">{state.fieldErrors.password}</p>
            )}
          </div>

          {state.error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-error">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-amber px-4 py-2 text-sm font-medium text-navy-dark hover:bg-amber-dark disabled:opacity-60"
          >
            {pending ? "Creation..." : "Creer mon etablissement"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword, type ResetPasswordState } from "@/app/actions/auth";

const initialState: ResetPasswordState = {};

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, formAction, pending] = useActionState(resetPassword, initialState);

  return (
    <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
      <h1 className="font-heading text-2xl font-bold text-navy">
        Nouveau mot de passe
      </h1>

      {state.success ? (
        <p className="mt-4 text-sm text-neutral-600">
          Mot de passe mis a jour. Vous pouvez maintenant vous{" "}
          <a href="/login" className="text-navy underline">
            connecter
          </a>
          .
        </p>
      ) : (
        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="token" value={token} />
          <div>
            <label className="block text-sm font-medium text-neutral-900">
              Nouveau mot de passe
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
            className="w-full rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60"
          >
            {pending ? "Mise a jour..." : "Reinitialiser"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <Suspense fallback={<p className="text-sm text-neutral-500">Chargement...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

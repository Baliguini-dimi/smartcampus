"use client";

import { useActionState } from "react";
import { requestPasswordReset, type ForgotPasswordState } from "@/app/actions/auth";

const initialState: ForgotPasswordState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="font-heading text-2xl font-bold text-navy">Mot de passe oublie</h1>

        {state.submitted ? (
          <p className="mt-4 text-sm text-neutral-600">
            Si un compte existe avec cet email, un lien de reinitialisation a ete envoye.
          </p>
        ) : (
          <form action={formAction} className="mt-6 space-y-4">
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
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60"
            >
              {pending ? "Envoi..." : "Envoyer le lien"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

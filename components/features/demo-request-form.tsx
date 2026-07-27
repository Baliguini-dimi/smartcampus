"use client";

import { useActionState } from "react";
import { submitDemoRequest, type DemoRequestState } from "@/app/actions/demo-request";

const initialState: DemoRequestState = {};

export function DemoRequestForm() {
  const [state, formAction, pending] = useActionState(submitDemoRequest, initialState);

  if (state.success) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <p className="font-heading text-lg font-semibold text-navy">
          Merci pour votre demande.
        </p>
        <p className="mt-2 text-sm text-neutral-600">
          Notre équipe vous recontactera très prochainement.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-900">
            Nom de l&apos;établissement
          </label>
          <input
            name="institutionName"
            required
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
          />
          {state.fieldErrors?.institutionName && (
            <p className="mt-1 text-xs text-error">{state.fieldErrors.institutionName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900">Votre nom</label>
          <input
            name="contactName"
            required
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
          />
          {state.fieldErrors?.contactName && (
            <p className="mt-1 text-xs text-error">{state.fieldErrors.contactName}</p>
          )}
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
            Téléphone (optionnel)
          </label>
          <input
            name="phone"
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-neutral-900">
          Votre message (optionnel)
        </label>
        <textarea
          name="message"
          rows={3}
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
        />
      </div>
      {state.error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-error">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition hover:bg-navy-dark disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Envoi..." : "Demander une démo"}
      </button>
    </form>
  );
}

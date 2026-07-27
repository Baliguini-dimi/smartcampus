"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createStudent, type CreateStudentState } from "@/app/actions/students";

const initialState: CreateStudentState = {};

export default function NewStudentPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createStudent, initialState);

  useEffect(() => {
    if (!state.error && !state.fieldErrors && state !== initialState) {
      router.push("/students");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="p-8">
      <Link
        href="/students"
        className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour a la liste
      </Link>

      <h1 className="mt-4 font-heading text-2xl font-bold text-neutral-900">
        Ajouter un etudiant
      </h1>

      <form action={formAction} className="mt-6 max-w-2xl space-y-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900">Prenom</label>
            <input name="firstName" required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
            {state.fieldErrors?.firstName && <p className="mt-1 text-xs text-error">{state.fieldErrors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-900">Nom</label>
            <input name="lastName" required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
            {state.fieldErrors?.lastName && <p className="mt-1 text-xs text-error">{state.fieldErrors.lastName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900">Email</label>
            <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
            {state.fieldErrors?.email && <p className="mt-1 text-xs text-error">{state.fieldErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-900">Mot de passe initial</label>
            <input name="password" type="password" required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
            {state.fieldErrors?.password && <p className="mt-1 text-xs text-error">{state.fieldErrors.password}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-900">Matricule</label>
          <input name="matricule" required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
          {state.fieldErrors?.matricule && <p className="mt-1 text-xs text-error">{state.fieldErrors.matricule}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900">Departement</label>
            <input name="department" className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-900">Filiere</label>
            <input name="fieldOfStudy" className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900">Niveau (ex: L1, M2)</label>
            <input name="level" className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-900">Annee academique</label>
            <input name="academicYear" placeholder="2025-2026" className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
          </div>
        </div>

        {state.error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-error">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60"
        >
          {pending ? "Creation..." : "Creer l'etudiant"}
        </button>
      </form>
    </div>
  );
}

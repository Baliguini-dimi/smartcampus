"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createEnrollment, type EnrollmentFormState } from "@/app/actions/enrollments";

const initialState: EnrollmentFormState = {};

export function AddEnrollmentForm({
  courseId,
  availableStudents,
}: {
  courseId: number;
  availableStudents: { id: number; name: string; matricule: string }[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(createEnrollment, initialState);

  useEffect(() => {
    if (!state.error && !state.fieldErrors && state !== initialState) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  if (availableStudents.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        Tous les etudiants de l&apos;etablissement sont deja inscrits, ou aucun etudiant n&apos;existe encore.
      </p>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="courseId" value={courseId} />
      <div className="flex-1 min-w-[240px]">
        <label className="block text-sm font-medium text-neutral-900">Etudiant</label>
        <select
          name="studentId"
          required
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy"
        >
          <option value="">Selectionner un etudiant</option>
          {availableStudents.map((s) => (
            <option key={s.id} value={s.id}>
              {s.matricule} - {s.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60"
      >
        {pending ? "Inscription..." : "Inscrire"}
      </button>
      {state.error && <p className="w-full text-xs text-error">{state.error}</p>}
    </form>
  );
}
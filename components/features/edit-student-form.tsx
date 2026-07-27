"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { updateStudent, type UpdateStudentState } from "@/app/actions/students";

const initialState: UpdateStudentState = {};

const STATUS_OPTIONS = [
  { value: "active", label: "Actif" },
  { value: "suspended", label: "Suspendu" },
  { value: "graduated", label: "Diplome" },
  { value: "dropped", label: "Abandon" },
  { value: "on_leave", label: "Conge" },
];

export function EditStudentForm({
  studentId,
  defaultValues,
}: {
  studentId: number;
  defaultValues: {
    firstName: string;
    lastName: string;
    email: string;
    matricule: string;
    department: string;
    fieldOfStudy: string;
    level: string;
    academicYear: string;
    status: string;
  };
}) {
  const router = useRouter();
  const updateStudentWithId = updateStudent.bind(null, studentId);
  const [state, formAction, pending] = useActionState(updateStudentWithId, initialState);

  useEffect(() => {
    if (!state.error && !state.fieldErrors && state !== initialState) {
      router.push("/students");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mt-6 max-w-2xl space-y-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-900">Prenom</label>
          <input name="firstName" defaultValue={defaultValues.firstName} required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
          {state.fieldErrors?.firstName && <p className="mt-1 text-xs text-error">{state.fieldErrors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900">Nom</label>
          <input name="lastName" defaultValue={defaultValues.lastName} required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
          {state.fieldErrors?.lastName && <p className="mt-1 text-xs text-error">{state.fieldErrors.lastName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-900">Email</label>
          <input name="email" type="email" defaultValue={defaultValues.email} required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
          {state.fieldErrors?.email && <p className="mt-1 text-xs text-error">{state.fieldErrors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900">Matricule</label>
          <input name="matricule" defaultValue={defaultValues.matricule} required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
          {state.fieldErrors?.matricule && <p className="mt-1 text-xs text-error">{state.fieldErrors.matricule}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-900">Departement</label>
          <input name="department" defaultValue={defaultValues.department} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900">Filiere</label>
          <input name="fieldOfStudy" defaultValue={defaultValues.fieldOfStudy} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-900">Niveau</label>
          <input name="level" defaultValue={defaultValues.level} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900">Annee academique</label>
          <input name="academicYear" defaultValue={defaultValues.academicYear} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900">Statut</label>
          <select name="status" defaultValue={defaultValues.status} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy">
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
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
        {pending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}

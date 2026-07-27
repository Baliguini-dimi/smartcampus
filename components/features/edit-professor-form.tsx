"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfessor, type UpdateProfessorState } from "@/app/actions/professors";

const initialState: UpdateProfessorState = {};

const STATUS_OPTIONS = [
  { value: "active", label: "Actif" },
  { value: "on_leave", label: "Conge" },
  { value: "retired", label: "Retraite" },
  { value: "terminated", label: "Termine" },
];

export function EditProfessorForm({
  professorId,
  defaultValues,
}: {
  professorId: number;
  defaultValues: {
    firstName: string;
    lastName: string;
    email: string;
    employeeId: string;
    department: string;
    specialization: string;
    qualification: string;
    officeLocation: string;
    status: string;
  };
}) {
  const router = useRouter();
  const updateProfessorWithId = updateProfessor.bind(null, professorId);
  const [state, formAction, pending] = useActionState(updateProfessorWithId, initialState);

  useEffect(() => {
    if (!state.error && !state.fieldErrors && state !== initialState) {
      router.push("/professors");
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
          <label className="block text-sm font-medium text-neutral-900">Matricule employe</label>
          <input name="employeeId" defaultValue={defaultValues.employeeId} required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
          {state.fieldErrors?.employeeId && <p className="mt-1 text-xs text-error">{state.fieldErrors.employeeId}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-900">Departement</label>
          <input name="department" defaultValue={defaultValues.department} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900">Specialisation</label>
          <input name="specialization" defaultValue={defaultValues.specialization} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-900">Qualification</label>
          <input name="qualification" defaultValue={defaultValues.qualification} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900">Bureau</label>
          <input name="officeLocation" defaultValue={defaultValues.officeLocation} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
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

      {state.error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-error">{state.error}</p>}

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
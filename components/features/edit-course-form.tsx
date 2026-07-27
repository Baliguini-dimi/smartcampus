"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateCourse, type CourseFormState } from "@/app/actions/courses";

const initialState: CourseFormState = {};
const COURSE_TYPES = ["CM", "TD", "TP", "Mixte"];
const STATUS_OPTIONS = [
  { value: "active", label: "Actif" },
  { value: "inactive", label: "Inactif" },
  { value: "archived", label: "Archive" },
];

export function EditCourseForm({
  courseId,
  professors,
  defaultValues,
}: {
  courseId: number;
  professors: { id: number; name: string }[];
  defaultValues: {
    code: string;
    title: string;
    description: string;
    department: string;
    level: string;
    credits: string;
    coefficient: string;
    capacity: number;
    semester: number;
    academicYear: string;
    type: string;
    professorId: number | string;
    status: string;
  };
}) {
  const router = useRouter();
  const updateCourseWithId = updateCourse.bind(null, courseId);
  const [state, formAction, pending] = useActionState(updateCourseWithId, initialState);

  useEffect(() => {
    if (!state.error && !state.fieldErrors && state !== initialState) {
      router.push("/courses");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mt-6 max-w-2xl space-y-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-900">Code du cours</label>
          <input name="code" defaultValue={defaultValues.code} required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
          {state.fieldErrors?.code && <p className="mt-1 text-xs text-error">{state.fieldErrors.code}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900">Titre</label>
          <input name="title" defaultValue={defaultValues.title} required className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
          {state.fieldErrors?.title && <p className="mt-1 text-xs text-error">{state.fieldErrors.title}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-900">Description</label>
        <textarea name="description" defaultValue={defaultValues.description} rows={2} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-900">Departement</label>
          <input name="department" defaultValue={defaultValues.department} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900">Niveau</label>
          <input name="level" defaultValue={defaultValues.level} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-900">Credits</label>
          <input name="credits" type="number" step="0.5" defaultValue={defaultValues.credits} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900">Coefficient</label>
          <input name="coefficient" type="number" step="0.5" defaultValue={defaultValues.coefficient} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900">Capacite</label>
          <input name="capacity" type="number" defaultValue={defaultValues.capacity} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900">Semestre</label>
          <select name="semester" defaultValue={defaultValues.semester} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy">
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-900">Type</label>
          <select name="type" defaultValue={defaultValues.type} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy">
            {COURSE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900">Annee academique</label>
          <input name="academicYear" defaultValue={defaultValues.academicYear} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900">Professeur</label>
          <select name="professorId" defaultValue={defaultValues.professorId} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-navy">
            <option value="">Non assigne</option>
            {professors.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
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
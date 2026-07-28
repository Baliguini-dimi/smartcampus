"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { updateEnrollmentStatus, deleteEnrollment } from "@/app/actions/enrollments";

const STATUS_OPTIONS = [
  { value: "enrolled", label: "Inscrit" },
  { value: "completed", label: "Termine" },
  { value: "failed", label: "Echoue" },
  { value: "dropped", label: "Abandon" },
];

export function EnrollmentRowActions({
  enrollmentId,
  status,
  studentName,
}: {
  enrollmentId: number;
  status: string;
  studentName: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleStatusChange(newStatus: string) {
    setPending(true);
    const result = await updateEnrollmentStatus(enrollmentId, newStatus);
    setPending(false);
    if (result.error) {
      window.alert(result.error);
      return;
    }
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(`Retirer ${studentName} de ce cours ?`);
    if (!confirmed) return;

    setPending(true);
    const result = await deleteEnrollment(enrollmentId);
    setPending(false);
    if (result.error) {
      window.alert(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <select
        defaultValue={status}
        disabled={pending}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="rounded-md border border-neutral-200 px-2 py-1 text-xs outline-none focus:border-navy"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <button
        onClick={handleDelete}
        disabled={pending}
        className="rounded-md p-1.5 text-neutral-500 hover:bg-red-50 hover:text-error disabled:opacity-50"
        aria-label="Retirer"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
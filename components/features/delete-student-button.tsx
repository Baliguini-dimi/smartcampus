"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteStudent } from "@/app/actions/students";

export function DeleteStudentButton({
  studentId,
  studentName,
}: {
  studentId: number;
  studentName: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(`Supprimer ${studentName} ? Cette action est irreversible.`);
    if (!confirmed) return;

    setPending(true);
    const result = await deleteStudent(studentId);
    setPending(false);

    if (result.error) {
      window.alert(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="rounded-md p-1.5 text-neutral-500 hover:bg-red-50 hover:text-error disabled:opacity-50"
      aria-label="Supprimer"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
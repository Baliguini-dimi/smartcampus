"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteProfessor } from "@/app/actions/professors";

export function DeleteProfessorButton({
  professorId,
  professorName,
}: {
  professorId: number;
  professorName: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(`Supprimer ${professorName} ? Cette action est irreversible.`);
    if (!confirmed) return;

    setPending(true);
    const result = await deleteProfessor(professorId);
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
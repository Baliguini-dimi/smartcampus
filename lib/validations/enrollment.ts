import { z } from "zod";

export const createEnrollmentSchema = z.object({
  studentId: z.coerce.number().int().positive("Etudiant requis"),
  courseId: z.coerce.number().int().positive(),
});
export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;

export const updateEnrollmentStatusSchema = z.object({
  status: z.enum(["enrolled", "dropped", "completed", "failed"]),
});
export type UpdateEnrollmentStatusInput = z.infer<typeof updateEnrollmentStatusSchema>;
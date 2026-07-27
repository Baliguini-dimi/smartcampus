import { z } from "zod";

export const createStudentSchema = z.object({
  firstName: z.string().min(1, "Prenom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caracteres minimum"),
  matricule: z.string().min(1, "Matricule requis"),
  department: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  level: z.string().optional(),
  academicYear: z.string().optional(),
});
export type CreateStudentInput = z.infer<typeof createStudentSchema>;

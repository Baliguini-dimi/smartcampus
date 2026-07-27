import { z } from "zod";

export const createProfessorSchema = z.object({
  firstName: z.string().min(1, "Prenom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caracteres minimum"),
  employeeId: z.string().min(1, "Matricule employe requis"),
  department: z.string().optional(),
  specialization: z.string().optional(),
  qualification: z.string().optional(),
  officeLocation: z.string().optional(),
});
export type CreateProfessorInput = z.infer<typeof createProfessorSchema>;

export const updateProfessorSchema = z.object({
  firstName: z.string().min(1, "Prenom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  employeeId: z.string().min(1, "Matricule employe requis"),
  department: z.string().optional(),
  specialization: z.string().optional(),
  qualification: z.string().optional(),
  officeLocation: z.string().optional(),
  status: z.enum(["active", "on_leave", "retired", "terminated"]),
});
export type UpdateProfessorInput = z.infer<typeof updateProfessorSchema>;
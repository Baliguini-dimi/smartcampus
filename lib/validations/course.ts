import { z } from "zod";

const COURSE_TYPES = ["CM", "TD", "TP", "Mixte"] as const;

export const createCourseSchema = z.object({
  code: z.string().min(1, "Code requis"),
  title: z.string().min(1, "Titre requis"),
  description: z.string().optional(),
  department: z.string().optional(),
  level: z.string().optional(),
  credits: z.coerce.number().min(0).default(3),
  coefficient: z.coerce.number().min(0).default(1),
  capacity: z.coerce.number().int().min(1).default(50),
  semester: z.coerce.number().int().min(1).max(2).default(1),
  academicYear: z.string().optional(),
  type: z.enum(COURSE_TYPES).default("CM"),
  professorId: z.coerce.number().int().optional(),
});
export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = createCourseSchema.extend({
  status: z.enum(["active", "inactive", "archived"]),
});
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
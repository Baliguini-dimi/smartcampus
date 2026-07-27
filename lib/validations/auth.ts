import { z } from "zod";

export const registerSchema = z.object({
  tenantName: z.string().min(2, "Le nom de l'etablissement est trop court"),
  tenantSlug: z
    .string()
    .min(2, "L'identifiant est trop court")
    .regex(/^[a-z0-9-]+$/, "Lettres minuscules, chiffres et tirets uniquement"),
  firstName: z.string().min(1, "Prenom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caracteres minimum"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Jeton manquant"),
  password: z.string().min(8, "8 caracteres minimum"),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const demoRequestSchema = z.object({
  institutionName: z.string().min(2, "Nom de l etablissement requis"),
  contactName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  message: z.string().optional(),
});
export type DemoRequestInput = z.infer<typeof demoRequestSchema>;


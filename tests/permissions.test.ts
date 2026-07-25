import { describe, it, expect } from "vitest";
import { can } from "../lib/permissions";

describe("RBAC - matrice de permissions", () => {
  it("un admin peut créer des étudiants", () => {
    expect(can("admin", "create", "students")).toBe(true);
  });

  it("un étudiant ne peut pas créer des étudiants", () => {
    expect(can("student", "create", "students")).toBe(false);
  });

  it("un professeur peut noter mais pas supprimer une note", () => {
    expect(can("professor", "update", "grades")).toBe(true);
    expect(can("professor", "delete", "grades")).toBe(false);
  });

  it("un parent ne peut que lire les notes et présences", () => {
    expect(can("parent", "read", "grades")).toBe(true);
    expect(can("parent", "update", "grades")).toBe(false);
  });

  it("seul le super_admin accède au panneau super admin", () => {
    expect(can("super_admin", "read", "super_admin_panel")).toBe(true);
    expect(can("admin", "read", "super_admin_panel")).toBe(false);
  });
});

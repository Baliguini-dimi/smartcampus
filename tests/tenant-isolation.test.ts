import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

const suffix = Date.now();
let tenantAId: number;
let tenantBId: number;

beforeAll(async () => {
  const plan = await prisma.plan.findFirst({ where: { name: "free" } });
  if (!plan) {
    throw new Error(
      "Plan 'free' introuvable - lance `npx prisma db seed` avant de relancer les tests."
    );
  }

  const tenantA = await prisma.tenant.create({
    data: {
      name: "Test Tenant A",
      slug: `test-tenant-a-${suffix}`,
      email: `tenant-a-${suffix}@test.local`,
      planId: plan.id,
      status: "active",
    },
  });

  const tenantB = await prisma.tenant.create({
    data: {
      name: "Test Tenant B",
      slug: `test-tenant-b-${suffix}`,
      email: `tenant-b-${suffix}@test.local`,
      planId: plan.id,
      status: "active",
    },
  });

  tenantAId = tenantA.id;
  tenantBId = tenantB.id;

  const passwordHash = await hashPassword("TestPass123!");

  const userA = await prisma.user.create({
    data: {
      tenantId: tenantAId,
      email: `student-a-${suffix}@test.local`,
      password: passwordHash,
      firstName: "Etudiant",
      lastName: "A",
      role: "student",
    },
  });

  const userB = await prisma.user.create({
    data: {
      tenantId: tenantBId,
      email: `student-b-${suffix}@test.local`,
      password: passwordHash,
      firstName: "Etudiant",
      lastName: "B",
      role: "student",
    },
  });

  await prisma.student.create({
    data: { tenantId: tenantAId, userId: userA.id, matricule: `MAT-A-${suffix}` },
  });

  await prisma.student.create({
    data: { tenantId: tenantBId, userId: userB.id, matricule: `MAT-B-${suffix}` },
  });
});

afterAll(async () => {
  // onDelete: Cascade sur Tenant -> User/Student : ceci nettoie tout automatiquement.
  await prisma.tenant.deleteMany({ where: { id: { in: [tenantAId, tenantBId] } } });
  await prisma.$disconnect();
});

describe("Isolation multi-tenant (SECURITY.md section 3)", () => {
  it("une requete filtree par tenantId A ne retourne aucune donnee du tenant B", async () => {
    const students = await prisma.student.findMany({ where: { tenantId: tenantAId } });
    expect(students.length).toBeGreaterThan(0);
    expect(students.every((s) => s.tenantId === tenantAId)).toBe(true);
    expect(students.some((s) => s.tenantId === tenantBId)).toBe(false);
  });

  it("meme isolation sur la table des utilisateurs", async () => {
    const users = await prisma.user.findMany({ where: { tenantId: tenantAId } });
    expect(users.every((u) => u.tenantId === tenantAId)).toBe(true);
    expect(users.some((u) => u.tenantId === tenantBId)).toBe(false);
  });

  it("deux tenants differents peuvent utiliser le meme email (unicite scopee au tenant)", async () => {
    const sameEmail = `duplicate-${suffix}@test.local`;
    const hash = await hashPassword("TestPass123!");

    const u1 = await prisma.user.create({
      data: { tenantId: tenantAId, email: sameEmail, password: hash, firstName: "X", lastName: "Y", role: "student" },
    });
    const u2 = await prisma.user.create({
      data: { tenantId: tenantBId, email: sameEmail, password: hash, firstName: "X", lastName: "Y", role: "student" },
    });

    expect(u1.id).not.toBe(u2.id);

    await prisma.user.deleteMany({ where: { id: { in: [u1.id, u2.id] } } });
  });
});

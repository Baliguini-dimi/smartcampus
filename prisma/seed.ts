import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../lib/password";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const [free] = await Promise.all([
    prisma.plan.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1, name: "free", label: "Gratuit", priceMonth: 0, priceYear: 0,
        maxStudents: 50, maxCourses: 10, maxProfessors: 5, maxAiCalls: 20,
      },
    }),
    prisma.plan.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2, name: "pro", label: "Pro", priceMonth: 15000, priceYear: 150000,
        maxStudents: 500, maxCourses: 100, maxProfessors: 20, maxAiCalls: 200,
      },
    }),
    prisma.plan.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3, name: "premium", label: "Premium", priceMonth: 35000, priceYear: 350000,
        maxStudents: 999999, maxCourses: 999999, maxProfessors: 999999, maxAiCalls: 999999,
      },
    }),
  ]);

  const tenant = await prisma.tenant.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      name: "Institut Demo",
      slug: "demo",
      email: "contact@institut-demo.test",
      planId: free.id,
      status: "active",
    },
  });

  const passwordHash = await hashPassword("Password123!");

  await prisma.user.upsert({
    where: { unique_email_tenant: { email: "admin@demo.test", tenantId: tenant.id } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: "admin@demo.test",
      password: passwordHash,
      firstName: "Admin",
      lastName: "Demo",
      role: "admin",
      status: "active",
    },
  });

  console.log("Seed terminé.");
  console.log("Tenant:", tenant.slug);
  console.log("Login: admin@demo.test / Password123!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

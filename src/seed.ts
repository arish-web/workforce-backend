import { prisma } from "./config/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const password = await bcrypt.hash("12345678", 10);

  // ✅ Create ONE organization
  const org = await prisma.organization.create({
    data: {
      name: "Standard Insights",
    },
  });

  // ADMIN
  await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      password,
      role: "ADMIN",
    },
  });

  // MANAGER
  await prisma.user.create({
    data: {
      email: "manager@gmail.com",
      password,
      role: "MANAGER",
    },
  });

  // EMPLOYEE
  await prisma.user.create({
    data: {
      email: "employee@gmail.com",
      password,
      role: "EMPLOYEE",
    },
  });

  console.log("Seeded clean DB with 1 org + users");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

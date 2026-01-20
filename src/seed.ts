import { prisma } from "./config/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const password = await bcrypt.hash("12345678", 10);

  // ADMIN
  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      email: "admin@gmail.com",
      password,
      role: "ADMIN",
    },
  });

  // MANAGER
  await prisma.user.upsert({
    where: { email: "manager@gmail.com" },
    update: {},
    create: {
      email: "manager@gmail.com",
      password,
      role: "MANAGER",
    },
  });

  // EMPLOYEE
  await prisma.user.upsert({
    where: { email: "employee@gmail.com" },
    update: {},
    create: {
      email: "employee@gmail.com",
      password,
      role: "EMPLOYEE",
    },
  });

  console.log("Seeded: ADMIN, MANAGER, EMPLOYEE");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

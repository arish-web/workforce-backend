// import "dotenv/config";
// import bcrypt from "bcrypt";
// import { prisma } from "./config/prisma";

// async function main() {
//   const password = await bcrypt.hash("12345678", 10);

//   await prisma.user.create({
//     data: {
//       email: "admin@test.com",
//       password,
//       role: "ADMIN",
//     },
//   });

//   console.log("Admin user created");
// }

// main()
//   .catch(console.error)
//   .finally(() => prisma.$disconnect());


import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "./config/prisma";

async function main() {
  const password = await bcrypt.hash("12345678", 10);

  // ADMIN
  await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      password,
      role: "ADMIN",
    },
  });

  // MANAGER
  await prisma.user.upsert({
    where: { email: "manager@test.com" },
    update: {},
    create: {
      email: "manager@test.com",
      password,
      role: "MANAGER",
    },
  });

  // EMPLOYEE
  await prisma.user.upsert({
    where: { email: "employee@test.com" },
    update: {},
    create: {
      email: "employee@test.com",
      password,
      role: "EMPLOYEE",
    },
  });

  console.log("Admin, Manager, Employee users created");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

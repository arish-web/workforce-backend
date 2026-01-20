"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./config/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    const password = await bcryptjs_1.default.hash("12345678", 10);
    // ADMIN
    await prisma_1.prisma.user.upsert({
        where: { email: "admin@gmail.com" },
        update: {},
        create: {
            email: "admin@gmail.com",
            password,
            role: "ADMIN",
        },
    });
    // MANAGER
    await prisma_1.prisma.user.upsert({
        where: { email: "manager@gmail.com" },
        update: {},
        create: {
            email: "manager@gmail.com",
            password,
            role: "MANAGER",
        },
    });
    // EMPLOYEE
    await prisma_1.prisma.user.upsert({
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
    await prisma_1.prisma.$disconnect();
});

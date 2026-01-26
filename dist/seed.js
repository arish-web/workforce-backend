"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./config/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    const password = await bcryptjs_1.default.hash("12345678", 10);
    // ✅ Create ONE organization
    const org = await prisma_1.prisma.organization.create({
        data: {
            name: "Standard Insights",
        },
    });
    // ADMIN
    await prisma_1.prisma.user.create({
        data: {
            email: "admin@gmail.com",
            password,
            role: "ADMIN",
        },
    });
    // MANAGER
    await prisma_1.prisma.user.create({
        data: {
            email: "manager@gmail.com",
            password,
            role: "MANAGER",
        },
    });
    // EMPLOYEE
    await prisma_1.prisma.user.create({
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
    .finally(() => prisma_1.prisma.$disconnect());

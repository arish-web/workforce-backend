"use strict";
// import "dotenv/config";
// import bcrypt from "bcrypt";
// import { prisma } from "./config/prisma";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("./config/prisma");
async function main() {
    const password = await bcrypt_1.default.hash("12345678", 10);
    // ADMIN
    await prisma_1.prisma.user.upsert({
        where: { email: "admin@test.com" },
        update: {},
        create: {
            email: "admin@test.com",
            password,
            role: "ADMIN",
        },
    });
    // MANAGER
    await prisma_1.prisma.user.upsert({
        where: { email: "manager@test.com" },
        update: {},
        create: {
            email: "manager@test.com",
            password,
            role: "MANAGER",
        },
    });
    // EMPLOYEE
    await prisma_1.prisma.user.upsert({
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
    .finally(() => prisma_1.prisma.$disconnect());

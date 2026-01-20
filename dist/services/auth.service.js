"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
exports.registerUser = registerUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../config/prisma");
const jwt_1 = require("../utils/jwt");
async function loginUser(email, password) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    let isValidPassword = false;
    if (user.password.startsWith("$2")) {
        isValidPassword = await bcryptjs_1.default.compare(password, user.password);
    }
    else {
        isValidPassword = password === user.password;
    }
    if (!isValidPassword) {
        throw new Error("Invalid credentials");
    }
    console.log("DB PASSWORD:", user.password);
    console.log("INPUT PASSWORD:", password);
    return {
        accessToken: (0, jwt_1.signAccessToken)({
            userId: user.id,
            role: user.role,
        }),
        refreshToken: (0, jwt_1.signRefreshToken)({
            userId: user.id,
        }),
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    };
}
async function registerUser(email, password, role) {
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role,
        },
    });
    return {
        id: user.id,
        email: user.email,
        role: user.role,
    };
}

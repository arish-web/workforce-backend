"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = void 0;
exports.loginUser = loginUser;
exports.registerUser = registerUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../config/prisma");
const jwt_1 = require("../utils/jwt");
const jwt_2 = require("../utils/jwt");
async function loginUser(email, password) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("Invalid credentials");
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    const payload = { userId: user.id, role: user.role };
    const accessToken = (0, jwt_1.signAccessToken)(payload);
    const refreshToken = (0, jwt_1.signRefreshToken)(payload);
    console.log("refreshToken", refreshToken);
    return {
        accessToken,
        refreshToken, // ✅
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
const refreshAccessToken = (refreshToken) => {
    if (!refreshToken) {
        throw new Error("Refresh token missing");
    }
    const decoded = (0, jwt_2.verifyRefreshToken)(refreshToken);
    const newAccessToken = (0, jwt_1.signAccessToken)({
        userId: decoded.userId,
        role: decoded.role,
    });
    return { accessToken: newAccessToken };
};
exports.refreshAccessToken = refreshAccessToken;

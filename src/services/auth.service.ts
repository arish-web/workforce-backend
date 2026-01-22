import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { verifyRefreshToken } from "../utils/jwt";



export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const payload = { userId: user.id, role: user.role };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  console.log("refreshToken",  refreshToken)
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


export async function registerUser(
  email: string,
  password: string,
  role: "ADMIN" | "MANAGER" | "EMPLOYEE"
) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
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


export const refreshAccessToken = (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token missing");
  }

  const decoded = verifyRefreshToken(refreshToken) as any;

  const newAccessToken = signAccessToken({
    userId: decoded.userId,
    role: decoded.role,
  });

  return { accessToken: newAccessToken };
};

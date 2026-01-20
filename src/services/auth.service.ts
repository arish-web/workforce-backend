import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { signAccessToken, signRefreshToken } from "../utils/jwt";

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  let isValidPassword = false;

  if (user.password.startsWith("$2")) {
    isValidPassword = await bcrypt.compare(password, user.password);
  } else {
    isValidPassword = password === user.password;
  }

  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  console.log("DB PASSWORD:", user.password);
console.log("INPUT PASSWORD:", password);

  return {
    accessToken: signAccessToken({
      userId: user.id,
      role: user.role,
    }),
    refreshToken: signRefreshToken({
      userId: user.id,
    }),
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

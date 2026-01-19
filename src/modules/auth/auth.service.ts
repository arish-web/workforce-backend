import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  return {
    accessToken: signAccessToken({ userId: user.id, role: user.role }),
    refreshToken: signRefreshToken({ userId: user.id }),
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

import { Request, Response } from "express";
import { loginUser, registerUser, refreshAccessToken  } from "../services/auth.service";
import { loginSchema, registerSchema } from "../validators/auth.schema";
import { AuthRequest } from "../middlewares/auth.middleware";
import { signAccessToken, verifyRefreshToken } from "../utils/jwt";

export async function login(req: Request, res: Response) {
  try {
    const body = loginSchema.parse(req.body);
    console.log("LOGIN BODY:", body);

    const data = await loginUser(body.email, body.password);
    return res.json(data);
  } catch (err: any) {
    console.error("LOGIN ERROR:", err.message);
    return res.status(401).json({ message: err.message });
  }
}

// export const refreshToken = (req: Request, res: Response) => {
//   try {
//     const { refreshToken } = req.body;
//     const token = refreshAccessToken(refreshToken);
//     res.json(token);
//   } catch (err: any) {
//     res.status(401).json({ message: err.message });
//   }
// };

export const refreshToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  console.log("refreshToken",   refreshToken)

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken) as any;

    const newAccessToken = signAccessToken({
      id: decoded.userI,
      role: decoded.role,
    });

    return res.json({
      accessToken: newAccessToken,
    });
  } catch {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};


export async function register(req: Request, res: Response) {
  try {
    const body = registerSchema.parse(req.body);

    const user = await registerUser(
      body.email,
      body.password,
      body.role
    );

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

/**
 * GET /auth/me
 */
export async function me(req: AuthRequest, res: Response) {
  return res.json({
    userId: req.user?.userId,
    role: req.user?.role,
  });
}


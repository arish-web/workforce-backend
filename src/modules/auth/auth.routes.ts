import { Router } from "express";
import { login } from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { prisma } from "../../config/prisma";

const router = Router();

// public
router.post("/login", login);

// protected (proof JWT works)
router.get("/me", requireAuth(), async (req, res) => {
  const { userId, role } = (req as any).user;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// role-protected example (ADMIN only)
router.get("/admin-check", requireAuth(["ADMIN"]), (req, res) => {
  res.json({ message: "Admin access granted" });
});

export default router;

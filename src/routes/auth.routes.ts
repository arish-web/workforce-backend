import { Router } from "express";
import { login, register, me } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

/**
 * Auth routes
 */
router.post("/login", login);
router.post("/register", register);
router.get("/me", requireAuth(), me);

export default router;

import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import {
  getManagerDashboardSummary,
  getManagerTasks,
  createManagerTask,
  getManagerEmployees,
} from "../../controllers/manager.controller";

const router = Router();

// 🔐 manager-only access
router.use(requireAuth());
router.use((requireAuth as any)(["MANAGER"]));
// router.use(requireAuth(["MANAGER"]));

// routes
router.get("/dashboard/summary", getManagerDashboardSummary as any);
router.get("/tasks", getManagerTasks as any);
router.post("/tasks", createManagerTask as any);
router.get("/employees", getManagerEmployees as any);

export default router;

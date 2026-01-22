import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import {
  // getManagerDashboardSummary,
  // listManagerEmployees,
  // listManagerTasks,
  // getManagerTaskById,
  getManagerTasks,
  createManagerTask,
  getManagerEmployees,
} from "../../controllers/manager.controller";

const router = Router();

// auth
// router.use((requireAuth as any)());
router.use((requireAuth as any)(["MANAGER"]));
// router.use(requireAuth(["MANAGER"]))


// routes — CAST CONTROLLERS
router.get("/tasks", getManagerTasks as any);
router.post("/tasks/create", createManagerTask as any);
router.get("/employees", getManagerEmployees as any);

// router.get("/dashboard-summary", getManagerDashboardSummary as any);
// router.get("/employees", listManagerEmployees as any);

// router.get("/tasks", listManagerTasks as any);
// router.get("/tasks/:id", getManagerTaskById as any);
// router.post("/tasks", createManagerTask as any);

export default router;

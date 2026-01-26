// src/routes/employee.routes.ts
import { Router } from "express";
import {
  getMyTasks,
  updateMyTaskStatus,
} from "../../controllers/employee.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

// 🔐 any logged-in employee
router.use(requireAuth());
router.use((requireAuth as any)(["EMPLOYEE"]));


// 📋 get tasks assigned to logged-in employee
router.get("/tasks", getMyTasks);

// ✏️ update status of own task
router.patch("/tasks/:id", updateMyTaskStatus);

export default router;

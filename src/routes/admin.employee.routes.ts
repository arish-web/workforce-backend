import { Router } from "express";
import {
  createEmployee,
  listEmployees,
  updateEmployee,
  toggleEmployeeStatus,
} from "../controllers/admin.employee.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Admin-only access
router.use(requireAuth(["ADMIN"]));

router.post("/employees", createEmployee);
router.get("/employees", listEmployees);
router.patch("/employees/:id", updateEmployee);
router.patch("/employees/:id/status", toggleEmployeeStatus);

export default router;

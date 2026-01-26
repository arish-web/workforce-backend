import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import {
  createEmployee,
  listEmployees,
  updateEmployee,
  toggleEmployeeStatus,
  createLocation,
  listLocations,
} from "../../controllers/admin.controller";

const router = Router();

// 🔐 Admin only
router.use(requireAuth());
router.use((requireAuth as any)(["ADMIN"]));

/* EMPLOYEES */
router.post("/employees", createEmployee);
router.get("/employees", listEmployees);
router.patch("/employees/:id", updateEmployee);
router.patch("/employees/:id/status", toggleEmployeeStatus);

/* MANAGERS (same table, role-based) */
router.post("/managers", (req, _res, next) => {
  req.body.role = "MANAGER";
  next();
}, createEmployee);

router.get("/managers", (req, _res, next) => {
  req.query.role = "MANAGER";
  next();
}, listEmployees);

/* LOCATIONS */
router.post("/locations", createLocation);
router.get("/locations", listLocations);

export default router;

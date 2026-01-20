import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  createLocation,
  listLocations,
} from "../controllers/admin.location.controller";
import { updateEmployee } from "../controllers/admin.employee.controller";

const router = Router();

router.use(requireAuth(["ADMIN"]));

router.post("/locations", createLocation);
router.patch("/employees/:id", updateEmployee);
router.get("/locations", listLocations);

export default router;

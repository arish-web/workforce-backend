import { Router } from "express";
import { getLocations } from "../controllers/location.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Any logged-in user can fetch locations
router.use(requireAuth);

router.get("/locations", getLocations);

export default router;

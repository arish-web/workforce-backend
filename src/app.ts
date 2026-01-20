import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "../src/routes/auth.routes";
import adminEmployeeRoutes from "../src/routes/admin.employee.routes";
import adminLocationRoutes from "../src/routes/admin.location.routes";
import managerEmployeeRoutes from "../src/routes/manager.employee.routes";
import { errorHandler } from "../src/middlewares/error.middleware";
import locationRoutes from "../src/routes/location.routes";
import employeeRoutes from "../src/routes/employee.routes"




const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(helmet());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminEmployeeRoutes);
app.use("/api/v1/admin", adminEmployeeRoutes);
app.use("/api/v1/admin", adminLocationRoutes);
app.use("/api/v1/manager", managerEmployeeRoutes);
app.use("/api/v1", locationRoutes);
app.use("/api/v1", employeeRoutes);


app.use(errorHandler);

export default app;

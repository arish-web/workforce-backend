import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "../src/routes/auth.routes";
import adminEmployeeRoutes from "./routes/admin.employee.routes";
import adminLocationRoutes from "./routes/admin.location.routes";
import managerEmployeeRoutes from "./routes/manager.employee.routes";
import { errorHandler } from "./middlewares/error.middleware";
import locationRoutes from "./routes/location.routes";
import employeeRoutes from "./routes/employee.routes";
import managerRoutes from "../src/api/v1/manager.routes";



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
app.use("/api/v1/manager", managerRoutes);

// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/org', orgRoutes);
// app.use('/api/v1/location', locationRoutes);
// app.use('/api/v1/employees', employeeRoutes);
// app.use('/api/v1/tasks', taskRoutes);
// app.use('/api/v1/reports', reportRoutes);


app.use(errorHandler);

export default app;

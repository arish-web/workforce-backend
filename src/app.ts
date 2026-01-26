import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import managerRoutes from "./api/v1/manager.routes";
import authRoutes from "./api/v1/auth.routes";
import adminRoutes from "./api/v1/admin.routes"
import employeeRoutes from "./api/v1/employee.routes";
// import adminEmployeeRoutes from "./routes/admin.employee.routes";
// import adminLocationRoutes from "./routes/admin.location.routes";
import { errorHandler } from "./middlewares/error.middleware";
import locationRoutes from "./routes/location.routes";



const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(helmet());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
// app.use("/api/v1/admin", adminEmployeeRoutes);
// app.use("/api/v1/admin", adminLocationRoutes);
app.use("/api/v1/manager", managerRoutes);
app.use("/api/v1/employee", employeeRoutes);
app.use("/api/v1", locationRoutes);


app.use(errorHandler);

export default app;

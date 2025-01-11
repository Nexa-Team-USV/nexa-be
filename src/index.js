import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";
import schedulingRoutes from "./routes/scheduling.route.js";
import proposalRoutes from "./routes/proposal.route.js";
import usersRoutes from "./routes/users.route.js";

import { authMiddleware } from "./middleware/authMiddleware.js";
import { rbacMiddleware } from "./middleware/rbacMiddleware.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/api/auth", authRoutes);

app.use(authMiddleware);
app.use(rbacMiddleware);

app.use("/api/users", usersRoutes);
app.use("/api/schedulings", schedulingRoutes);
app.use("/api/proposals", proposalRoutes);

app.listen(process.env.PORT, connectDB);

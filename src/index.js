import express from "express";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js";
import schedulingRoutes from "./routes/scheduling.route.js";
import usersRoutes from "./routes/users.route.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/scheduling", schedulingRoutes);
app.use("/api/users", usersRoutes);

app.listen(process.env.PORT, connectDB);

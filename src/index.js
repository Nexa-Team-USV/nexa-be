import express from "express";
import { connectDB } from "./db/connectDB.js";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js";
import usersRoutes from "./routes/users.route.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/users", usersRoutes);

app.listen(process.env.PORT, connectDB);

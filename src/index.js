import express from "express";
import { connectDB } from "./db/connectDB.js";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => connectDB());

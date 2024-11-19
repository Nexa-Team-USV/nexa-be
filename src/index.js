import express from "express";
import { connectDB } from "./db/connectDB.js";
import "dotenv/config";

const app = express();

app.get("/", (req, res) => {
  res.send("It works!");
});

app.listen(process.env.PORT, () => connectDB());

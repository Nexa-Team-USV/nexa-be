import express from "express";
import { schedule } from "../controllers/scheduling.controller.js";

const router = express.Router();

router.post("/schedule", schedule);

export default router;

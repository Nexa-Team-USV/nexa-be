import express from "express";
import {
  schedule,
  getAvailableClassrooms,
} from "../controllers/scheduling.controller.js";

const router = express.Router();

router.post("/schedule", schedule);

router.get("/available-classrooms", getAvailableClassrooms);

export default router;

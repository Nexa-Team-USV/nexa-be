import express from "express";
import {
  getClassrooms,
  getSchedulings,
  schedule,
} from "../controllers/scheduling.controller.js";

const router = express.Router();

router.post("/schedule", schedule);

router.get("/retrieve-schedulings/:type?", getSchedulings);

router.get("/retrieve-classrooms/:schedulingId", getClassrooms);

export default router;

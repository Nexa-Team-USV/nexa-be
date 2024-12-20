import express from "express";
import {
  editScheduling,
  getClassrooms,
  getSchedulings,
  removeScheduling,
  schedule,
} from "../controllers/scheduling.controller.js";

const router = express.Router();

router.post("/schedule", schedule);

router.get("/retrieve-schedulings/:type?", getSchedulings);

router.get("/retrieve-classrooms/:schedulingId", getClassrooms);

router.delete("/remove-scheduling/:schedulingId", removeScheduling);

router.put("/edit-scheduling/:schedulingId", editScheduling);

export default router;

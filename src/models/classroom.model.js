import { mongooseClient } from "../db/connectDB.js";
import { Scheduling } from "./scheduling.model.js";

const classroomSchema = new mongooseClient.Schema(
  {
    name: String,
    startTime: String,
    endTime: String,
    scheduling_id: { type: mongooseClient.ObjectId, ref: Scheduling },
  },
  { timestamps: true }
);

export const Classroom = mongooseClient.model("Classroom", classroomSchema);

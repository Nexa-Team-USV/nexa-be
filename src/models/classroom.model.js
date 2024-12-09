import { mongooseClient } from "../db/connectDB.js";
import { Scheduling } from "./scheduling.model.js";

const classroomSchema = new mongooseClient.Schema(
  {
    classroom: String,
    exam_id: { type: mongooseClient.ObjectId, ref: Scheduling },
  },
  { timestamps: true }
);

export const Classroom = mongooseClient.model("Classrooms", classroomSchema);

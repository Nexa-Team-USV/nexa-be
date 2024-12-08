import { mongooseClient } from "../db/connectDB.js";
import { User } from "./user.model.js";

const schedulingSchema = new mongooseClient.Schema(
  {
    type: String,
    title: String,
    studyType: String,
    group: String,
    date: String,
    startTime: String,
    endTime: String,
    assistants: String,
    teacher_id: { type: mongooseClient.ObjectId, ref: User },
  },
  { timestamps: true }
);

export const Scheduling = mongooseClient.model("Scheduling", schedulingSchema);

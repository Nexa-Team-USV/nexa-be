import { mongooseClient } from "../db/connectDB.js";

const notificationSchema = new mongooseClient.Schema(
  {
    user_id: String,
    request_id: String,
    message: String,
    status: String,
  },
  { timestamps: true }
);

export const Notification = mongooseClient.model(
  "Notification",
  notificationSchema
);

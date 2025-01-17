import { mongooseClient } from "../db/connectDB.js";

const userSchema = new mongooseClient.Schema(
  {
    username: String,
    email: String,
    password: String,
    studyType: String,
    group: String,
    role: String,
  },
  { timestamps: true }
);

export const User = mongooseClient.model("User", userSchema);

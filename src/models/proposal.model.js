import { mongooseClient } from "../db/connectDB.js";

const proposalSchema = new mongooseClient.Schema(
  {
    title: String,
    date: String,
    type: String,
    studyType: String,
    group: String,
    description: String,
  },
  { timestamps: true }
);

export const Proposal = mongooseClient.model("Proposal", proposalSchema);

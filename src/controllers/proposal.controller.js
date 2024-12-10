import { Proposal } from "../models/proposal.model.js";

export const proposal = async (req, res) => {
  const { title, date, type, studyType, group, description } = req.body;

  try {
    // Title valdiation
    if (!title) {
      throw new Error("The title field is required!");
    }

    // Date valdiation
    if (!date) {
      throw new Error("The date field is required!");
    }
    // Type valdiation
    if (!type) {
      throw new Error("The type field is required!");
    }

    if (!(type === "exam" || type === "test")) {
      throw new Error("Invalid type!");
    }

    // Specialization validation
    if (!studyType) {
      throw new Error("The specialization field is required!");
    }
    if (!(studyType === "licenta" || studyType === "master")) {
      throw new Error("Invalid study type!!");
    }
    // Group validation
    if (!group) {
      throw new Error("The group field is required!");
    }

    const proposal = new Proposal(req.body);
    await proposal.save();

    res.status(201).json({ message: "Proposal created!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

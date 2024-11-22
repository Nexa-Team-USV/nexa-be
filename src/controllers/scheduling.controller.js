import { Scheduling } from "../models/scheduling.model.js";
import { User } from "../models/user.model.js";

export const schedule = async (req, res) => {
  const {
    title,
    date,
    startTime,
    endTime,
    type,
    specialization,
    group,
    teacher_id,
  } = req.body;

  try {
    // Title valdiation
    if (!title) {
      throw new Error("The title field is required!");
    }

    // Date valdiation
    if (!date) {
      throw new Error("The date field is required!");
    }

    // Start time valdiation
    if (!startTime) {
      throw new Error("The start time field is required!");
    }

    // End time valdiation
    if (!endTime) {
      throw new Error("The end time field is required!");
    }

    // Type valdiation
    if (!type) {
      throw new Error("The type field is required!");
    }

    if (!(type === "exam" || type === "test")) {
      throw new Error("Invalid type!");
    }

    // Specialization validation
    if (!specialization) {
      throw new Error("The specialization field is required!");
    }

    if (!(specialization === "licenta" || specialization === "master")) {
      throw new Error("Invalid specialization!");
    }

    // Group validation
    if (!group) {
      throw new Error("The group field is required!");
    }

    // Teacher valdiation
    if (!teacher_id) {
      throw new Error("The teacher field is required!");
    }

    const teacherAlreadyExists = await User.findById(teacher_id);
    if (!teacherAlreadyExists) {
      throw new Error("This teacher doesn't exist!");
    }

    const scheduling = new Scheduling(req.body);
    await scheduling.save();

    res.status(201).json({ message: "Scheduling created!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

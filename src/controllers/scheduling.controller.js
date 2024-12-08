import { Scheduling } from "../models/scheduling.model.js";
import { User } from "../models/user.model.js";
import { formatTime } from "../utils/formatTime.js";
import validator from "validator";

const { isDate, isTime } = validator;

export const schedule = async (req, res) => {
  const {
    type,
    title,
    studyType,
    group,
    date,
    startTime,
    endTime,
    classrooms,
    assistants,
    teacher_id,
  } = req.body;

  console.log(req.body);

  try {
    // Type valdiation
    if (!type) {
      throw new Error("The type field is required!");
    }

    if (!(type === "exam" || type === "test")) {
      throw new Error("Invalid type!");
    }

    // Title valdiation
    if (!title) {
      throw new Error("The title field is required!");
    }

    // Study type validation
    if (!studyType) {
      throw new Error("The study type field is required!");
    }

    if (!(studyType === "licenta" || studyType === "master")) {
      throw new Error("Invalid study type!");
    }

    // Group validation
    if (!group) {
      throw new Error("The group field is required!");
    }

    // Date valdiation
    const examDate = new Date(date);
    const formattedExamDate = `${examDate.getFullYear()}/${examDate.getMonth()}/${examDate.getDate()}`;

    if (!date) {
      throw new Error("The date field is required!");
    }

    // if (!isDate(formattedExamDate)) {
    //   throw new Error("Invalid date!");
    // }

    // Start time vaidation
    const startTimeFormatted = formatTime(
      `${req.body.date}T${req.body.startTime}`
    );

    console.log(startTimeFormatted);

    if (!startTime) {
      throw new Error("The start time field is required!");
    }

    // if (!isTime(new Date())) {
    //   throw new Error("Invalid start time!");
    // }

    // End time validation
    const endTimeFormatted = formatTime(`${req.body.date}T${req.body.endTime}`);

    if (!endTime) {
      throw new Error("The start time field is required!");
    }

    // Classrooms validation
    if (!classrooms.length) {
      throw new Error("No classrooms added!");
    }

    // Assistants validation
    if (!assistants.length) {
      throw new Error("No classrooms added!");
    }

    // Teacher valdiation
    if (!teacher_id) {
      throw new Error("The teacher field is required!");
    }

    const teacherAlreadyExists = await User.findById(teacher_id);
    if (!teacherAlreadyExists) {
      throw new Error("This teacher doesn't exist!");
    }

    // const scheduling = new Scheduling(req.body);
    // await scheduling.save();

    res.status(201).json({ message: "Scheduling created!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

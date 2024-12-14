import { Classroom } from "../models/classroom.model.js";
import { Scheduling } from "../models/scheduling.model.js";
import { User } from "../models/user.model.js";
import { formatTime } from "../utils/formatTime.js";
import validator from "validator";
import { getMilliseconds } from "../utils/getMilliseconds.js";

const { isDate, isTime } = validator;

export const schedule = async (req, res) => {
  const { type, title, studyType, group, date, description, teacher_id } =
    req.body;

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

    if (title.length > 40) {
      throw new Error("The title shouldn't be longer than 40 characters!");
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
    const startTime = formatTime(`${req.body.date}T${req.body.startTime}`);

    if (!startTime) {
      throw new Error("The start time field is required!");
    }

    //  if (!isTime(new Date())) {
    //    throw new Error("Invalid start time!");
    //  }

    // End time validation
    const endTime = formatTime(`${req.body.date}T${req.body.endTime}`);

    if (!endTime) {
      throw new Error("The start time field is required!");
    }

    // Time validation
    const startTimeInHours = getMilliseconds(startTime) / 1000 / 60 / 60;
    const endTimeInHours = getMilliseconds(endTime) / 1000 / 60 / 60;

    if (endTimeInHours - startTimeInHours < 1) {
      throw new Error("The time for a scheduling should be least one hour!");
    }

    if (endTimeInHours - startTimeInHours > 3) {
      throw new Error(
        "The time for a scheduling shouldn't be more than three hours!"
      );
    }

    // Classrooms validation
    const classrooms = req.body.classrooms.filter(
      (classroom) => classroom !== ""
    );

    if (!classrooms.length) {
      throw new Error("No classrooms added!");
    }

    const allClassrooms = await Classroom.find({});
    for (let i = 0; i < classrooms.length; i++) {
      const checkAvailability = allClassrooms.find((classroom) => {
        if (
          getMilliseconds(startTime) <= getMilliseconds(classroom.startTime) &&
          getMilliseconds(endTime) >= getMilliseconds(classroom.startTime) &&
          getMilliseconds(startTime) <= getMilliseconds(classroom.endTime) &&
          getMilliseconds(endTime) >= getMilliseconds(classroom.endTime) &&
          classroom.name === classrooms[i]
        ) {
          return true;
        }

        return false;
      });

      if (checkAvailability) {
        throw new Error(`The ${classrooms[i]} classroom is not available!`);
      }
    }

    // Teacher valdiation
    if (!teacher_id) {
      throw new Error("The teacher field is required!");
    }

    const teacher = await User.findById(teacher_id);
    if (!teacher) {
      throw new Error("This teacher doesn't exist!");
    }

    // Assistants validation
    const assistants = req.body.assistants
      .filter((assistant) => assistant !== "")
      .join(", ");

    if (!assistants.length) {
      throw new Error("No assistants added!");
    }

    const scheduling = await Scheduling.create({
      type,
      title,
      studyType,
      group,
      date: new Date(examDate).toISOString(),
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      assistants,
      description,
      teacher_id,
    });

    for (let i = 0; i < classrooms.length; i++) {
      await Classroom.create({
        name: classrooms[i],
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        scheduling_id: scheduling.id,
      });
    }

    res.status(201).json({ scheduling });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSchedulings = async (req, res) => {
  const type = req.params.type ? req.params.type : "exams";
  const studyType = req.query.studyType;
  const group = req.query.group;

  try {
    const schedulings = await Scheduling.find({});

    if (!(type === "tests" || type === "exams")) {
      throw new Error("This type doesn't exist!");
    }

    const types = {
      exams: "exam",
      tests: "test",
    };

    const filteredByType = schedulings.filter(
      (scheduling) => scheduling.type === types[type]
    );

    const filteredByStudyType = studyType
      ? filteredByType.filter(
          (scheduling) => scheduling.studyType === studyType
        )
      : filteredByType;

    const filteredByGroup = group
      ? filteredByStudyType.filter((scheduling) => scheduling.group === group)
      : filteredByStudyType;

    res.status(200).json({ schedulings: filteredByGroup });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getClassrooms = async (req, res) => {
  const schedulingId = req.params.schedulingId;

  try {
    const data = await Classroom.find({ scheduling_id: schedulingId });

    const classrooms = data.map((classroom) => classroom.name).join(", ");

    res.status(200).json({ classrooms });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

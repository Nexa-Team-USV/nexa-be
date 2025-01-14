import { Classroom } from "../models/classroom.model.js";
import { Scheduling } from "../models/scheduling.model.js";
import { User } from "../models/user.model.js";
import { formatTime } from "../utils/formatTime.js";
import { getMilliseconds } from "../utils/getMilliseconds.js";

// ----------------- Create scheduling -----------------
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

    // Date validation
    const examDate = new Date(date);
    const currentDate = new Date();

    if (!date) {
      throw new Error("The date field is required and cannot be in the past!");
    }

    if (examDate < currentDate) {
      throw new Error("The date cannot be in the past!");
    }

    // Check for existing schedules on the same date for the same group
    const existingSchedules = await Scheduling.find({
      group: group.toUpperCase(),
      date: {
        $eq: examDate.toISOString().split("T")[0], // Only compare the date part
      },
    });

    if (existingSchedules.length > 0) {
      throw new Error(
        `An exam is already scheduled for group ${group} on this date!`
      );
    }

    // Check for duplicate exam titles
    const duplicateExam = await Scheduling.findOne({
      title,
      group: group.toUpperCase(),
      date: {
        $eq: examDate.toISOString().split("T")[0],
      },
    });

    if (duplicateExam) {
      throw new Error(
        `An exam with the title "${title}" is already scheduled for group ${group} on this date!`
      );
    }

    // Start time vaidation
    const startTime = formatTime(`${req.body.date}T${req.body.startTime}`);

    if (!startTime) {
      throw new Error("The start time field is required!");
    }

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
      studyType: studyType.toLowerCase(),
      group: group.toUpperCase(),
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

// ----------------- Get schedulings -----------------
export const getSchedulings = async (req, res) => {
  const type = req.params.type ? req.params.type : "exams";
  const studyType = req.query.studyType;
  const group = req.query.group;

  try {
    if (studyType || group) {
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
            (scheduling) =>
              scheduling.studyType.toLowerCase() === studyType.toLowerCase()
          )
        : filteredByType;

      const filteredByGroup = group
        ? filteredByStudyType.filter(
            (scheduling) =>
              scheduling.group.toLowerCase() === group.toLowerCase()
          )
        : filteredByStudyType;

      return res.status(200).json({ schedulings: filteredByGroup });
    }

    res.status(200).json({ schedulings: [] });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ----------------- Get classrooms -----------------
export const getClassrooms = async (req, res) => {
  const schedulingId = req.params.schedulingId;

  try {
    const scheduling = await Scheduling.findById(schedulingId);

    if (!scheduling) {
      throw new Error("This scheduling doesn't exist!");
    }

    const data = await Classroom.find({ scheduling_id: schedulingId });

    const classrooms = data.map((classroom) => classroom.name);

    res.status(200).json({ classrooms });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ----------------- Remove scheduling -----------------
export const removeScheduling = async (req, res) => {
  const schedulingId = req.params.schedulingId;

  try {
    const scheduling = await Scheduling.findByIdAndDelete(schedulingId);

    if (!scheduling) {
      throw new Error("This scheduling doesn't exist!");
    }

    await Classroom.deleteMany({
      scheduling_id: schedulingId,
    });

    res.status(200).json({ message: "Scheduling deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ----------------- Edit scheduling -----------------
export const editScheduling = async (req, res) => {
  const schedulingId = req.params.schedulingId;
  const { type, title, studyType, group, date, description } = req.body;

  try {
    // Check if the scheduling exists
    const scheduling = await Scheduling.findById(schedulingId);

    if (!scheduling) {
      throw new Error("This scheduling doesn't exist!");
    }

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

    if (!date) {
      throw new Error("The date field is required!");
    }

    // Start time vaidation
    const startTime = formatTime(`${req.body.date}T${req.body.startTime}`);

    if (!startTime) {
      throw new Error("The start time field is required!");
    }

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

    // Deletes the classrooms of the scheduling
    await Classroom.deleteMany({
      scheduling_id: schedulingId,
    });

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

    // Assistants validation
    const assistants = req.body.assistants
      .filter((assistant) => assistant !== "")
      .join(", ");

    if (!assistants.length) {
      throw new Error("No assistants added!");
    }

    const oldScheduling = await Scheduling.findByIdAndUpdate(schedulingId, {
      type,
      title,
      studyType,
      group,
      date: new Date(examDate).toISOString(),
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      assistants,
      description,
    });

    for (let i = 0; i < classrooms.length; i++) {
      await Classroom.create({
        name: classrooms[i],
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        scheduling_id: oldScheduling.id,
      });
    }

    const updatedScheduling = await Scheduling.findById(schedulingId);

    res.status(200).json({ scheduling: updatedScheduling });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import { Proposal } from "../models/proposal.model.js";
import { User } from "../models/user.model.js";

export const createProposal = async (req, res) => {
  const { title, date, type, studyType, group, description } = req.body;

  try {
    // Title validation
    if (!title) {
      throw new Error("The title field is required!");
    }

    if (title.length > 40) {
      throw new Error("The title shouldn't be longer than 40 characters!");
    }

    // Date validation
    const proposalDate = new Date(date);
    const currentDate = new Date();
    if (!date) {
      throw new Error("The date field is required!");
    }

    if (isNaN(proposalDate.getTime())) {
      throw new Error("The date should be valid!");
    }

    if (proposalDate < currentDate) {
      throw new Error("The date cannot be in the past!");
    }

    // Type validation
    if (!type || (type !== "exam" && type !== "test")) {
      throw new Error("Invalid type! Accepted values are 'exam' or 'test'.");
    }

    // Study type validation
    if (!studyType || (studyType !== "licenta" && studyType !== "master")) {
      throw new Error(
        "Invalid study type! Accepted values are 'licenta' or 'master'."
      );
    }

    // Group validation
    if (!group) {
      throw new Error("The group field is required!");
    }

    // Check for duplicate proposals
    const duplicateProposal = await Proposal.findOne({
      title,
      date: proposalDate.toISOString(),
      type,
      studyType,
      group,
    });

    if (duplicateProposal) {
      throw new Error(`A proposal with the same details already exists!`);
    }

    // Save proposal
    const proposal = await Proposal.create({
      title,
      date: proposalDate.toISOString(),
      type,
      studyType,
      group,
      description,
    });

    // Change the response to return 'propose' instead of 'proposal'
    res.status(201).json({ propose: proposal });
  } catch (error) {
    console.error("Error creating proposal:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const getProposals = async (req, res) => {
  const { type, studyType, group } = req.query;

  try {
    const proposals = await Proposal.find({});

    // Filter by type
    const filteredByType = type
      ? proposals.filter((proposal) => proposal.type === type)
      : proposals;

    // Filter by study type
    const filteredByStudyType = studyType
      ? filteredByType.filter((proposal) => proposal.studyType === studyType)
      : filteredByType;

    // Filter by group
    const filteredByGroup = group
      ? filteredByStudyType.filter((proposal) => proposal.group === group)
      : filteredByStudyType;

    res.status(200).json({ proposals: filteredByGroup });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProposalById = async (req, res) => {
  const { proposalId } = req.params;

  try {
    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      throw new Error("The requested proposal doesn't exist!");
    }

    res.status(200).json({ proposal });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProposal = async (req, res) => {
  const { proposalId } = req.params;
  const { title, date, type, studyType, group, description } = req.body;

  try {
    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      throw new Error("The proposal to update doesn't exist!");
    }

    // Update fields
    if (title) {
      if (title.length > 40) {
        throw new Error("The title shouldn't be longer than 40 characters!");
      }
      proposal.title = title;
    }

    if (date) {
      const proposalDate = new Date(date);
      if (isNaN(proposalDate.getTime())) {
        throw new Error("Invalid date format!");
      }
      proposal.date = proposalDate.toISOString();
    }

    if (type) {
      if (!(type === "exam" || type === "test")) {
        throw new Error("Invalid type! Accepted values are 'exam' or 'test'.");
      }
      proposal.type = type;
    }

    if (studyType) {
      if (!(studyType === "licenta" || studyType === "master")) {
        throw new Error(
          "Invalid study type! Accepted values are 'licenta' or 'master'."
        );
      }
      proposal.studyType = studyType;
    }

    if (group) {
      proposal.group = group;
    }

    if (description) {
      proposal.description = description;
    }

    await proposal.save();

    res.status(201).json({ proposal });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProposal = async (req, res) => {
  const { proposalId } = req.params;

  try {
    const proposal = await Proposal.findByIdAndDelete(proposalId);

    if (!proposal) {
      throw new Error("The proposal to delete doesn't exist!");
    }

    res.status(200).json({ message: "Proposal deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

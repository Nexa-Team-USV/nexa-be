import express from "express";
import {
  createProposal,
  getProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
} from "../controllers/proposal.controller.js";

const router = express.Router();

router.post("/create-proposal", createProposal);

router.get("/get-proposals", getProposals);

router.get("/:proposalId", getProposalById);

router.put("/:proposalId", updateProposal);

router.delete("/:proposalId", deleteProposal);

export default router;

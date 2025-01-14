import express from "express";
import { sendExamProposalEmail } from "../controllers/email.controller.js";

const router = express.Router();

router.post("/send-exam-proposal", sendExamProposalEmail);

export default router;

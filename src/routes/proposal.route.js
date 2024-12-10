import express from "express";
import { proposal } from "../controllers/proposal.controller.js";

const router = express.Router();

router.post("/proposal", proposal);

export default router;

import express from "express";
import { removeAccount } from "../controllers/users.controller.js";
const router = express.Router();

router.delete("/remove-account/:id", removeAccount);

export default router;

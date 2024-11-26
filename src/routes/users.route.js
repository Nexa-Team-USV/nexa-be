import express from "express";
import { removeAccount } from "../controllers/users.controller.js";
import { resetPassword } from "../controllers/auth.controller.js";
const router = express.Router();

router.put("/reset-password", resetPassword);

router.delete("/remove-account/:id", removeAccount);

export default router;

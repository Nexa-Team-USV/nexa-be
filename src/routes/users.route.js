import express from "express";

import {
  getCurrentUser,
  removeAccount,
  resetPassword,
  createAccount,
} from "../controllers/users.controller.js";

const router = express.Router();

router.post("/create-account", createAccount);

router.get("/current-user", getCurrentUser);

router.put("/reset-password", resetPassword);

router.delete("/remove-account", removeAccount);

export default router;

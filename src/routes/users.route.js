import express from "express";

import {
  getCurrentUser,
  removeAccount,
  resetPassword,
  createAccount,
  getUsers,
} from "../controllers/users.controller.js";

const router = express.Router();

router.post("/create-account", createAccount);

router.get("/current-user", getCurrentUser);

router.get("/:role?", getUsers);

router.put("/reset-password", resetPassword);

router.delete("/remove-account/:id", removeAccount);

export default router;

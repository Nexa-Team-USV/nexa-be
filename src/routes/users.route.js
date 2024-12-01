import express from "express";

import {
  getCurrentUser,
  removeAccount,
  resetPassword,
  createAccount,
  editProfile,
} from "../controllers/users.controller.js";

const router = express.Router();

router.post("/create-account", createAccount);

router.get("/current-user", getCurrentUser);

router.put("/reset-password", resetPassword);

router.delete("/remove-account", removeAccount);

router.put("/edit-profile", editProfile);

export default router;

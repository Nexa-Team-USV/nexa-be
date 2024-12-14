import express from "express";

import {
  getCurrentUser,
  removeAccount,
  resetPassword,
  createAccount,
  getUsers,
  editProfile,
  getUser,
} from "../controllers/users.controller.js";

const router = express.Router();

router.post("/create-account", createAccount);

router.get("/retrieve-current-user", getCurrentUser);

router.get("/retrieve-user/:userId", getUser);

router.get("/retrieve-users/:role", getUsers);

router.put("/reset-password", resetPassword);

router.delete("/remove-account/:id", removeAccount);

router.put("/edit-profile", editProfile);

export default router;

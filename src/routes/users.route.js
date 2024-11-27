import express from "express";

import {
  getCurrentUser,
  removeAccount,
  resetPassword,
  signup,
} from "../controllers/users.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.get("/current-user", getCurrentUser);

router.put("/reset-password", resetPassword);

router.delete("/remove-account", removeAccount);

export default router;

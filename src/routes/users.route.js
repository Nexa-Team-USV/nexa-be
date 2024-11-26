import express from "express";

import {
  getCurrentUser,
  removeAccount,
  resetPassword,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/current-user", getCurrentUser);

router.put("/reset-password", resetPassword);

router.delete("/remove-account/:id", removeAccount);

export default router;

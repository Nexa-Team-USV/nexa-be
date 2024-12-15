import express from "express";

import {
  login,
  forgotPassword,
  resetForgotPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.put("/reset-forgot-password", resetForgotPassword);

export default router;

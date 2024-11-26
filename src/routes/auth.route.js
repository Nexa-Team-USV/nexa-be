import express from "express";
import {
  login,
  resetPassword,
  signup,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.put("/reset-password", resetPassword);

export default router;

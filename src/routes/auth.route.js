import express from "express";
import {
  getCurrentUser,
  login,
  resetPassword,
  signup,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.put("/resetPassword", resetPassword);

router.get("/getCurrentUser", getCurrentUser);

export default router;

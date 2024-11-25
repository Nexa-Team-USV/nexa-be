import express from "express";
import {
  getCurrentUser,
  login,
  signup,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/getCurrentUser", getCurrentUser);

export default router;

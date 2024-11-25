import express from "express";
import {
  login,
  signup,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.put("/resetPassword", resetPassword);

export default router;

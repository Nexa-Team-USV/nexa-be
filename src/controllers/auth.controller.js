import validator from "validator";
import bcrypt from "bcrypt";
import { generate } from "generate-password";

import { User } from "../models/user.model.js";

const { isEmail } = validator;

export const signup = async (req, res) => {
  const { email, specialization, group, role } = req.body;

  try {
    // Email validation
    if (!email) {
      throw new Error("The email field is required!");
    }

    if (!isEmail(email)) {
      throw new Error("Invalid email!");
    }

    // Specialization validation
    if (!specialization) {
      throw new Error("The specialization field is required!");
    }

    if (!(specialization === "licenta" || specialization === "master")) {
      throw new Error("Invalid specialization!");
    }

    // Group validation
    if (!group) {
      throw new Error("The group field is required!");
    }

    // Role validation
    if (!role) {
      throw new Error("The role field is required!");
    }

    if (!(role === "admin" || role === "teacher" || role === "student")) {
      throw new Error("Invalid role!");
    }

    // Check if user exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      throw new Error("This user already exists!");
    }

    // Generates random password
    const password = generate({
      length: 40,
      numbers: true,
      symbols: true,
    });

    // Hashes the password
    const hashed = bcrypt.hashSync(password, 10);

    // Creates the user
    const user = new User({
      username: "",
      email,
      password: hashed,
      specialization,
      group,
      role,
    });
    await user.save();

    res.status(201).json({ message: "User created!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  res.send("login route");
};

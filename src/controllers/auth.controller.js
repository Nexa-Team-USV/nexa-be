import validator from "validator";
import bcrypt from "bcrypt";

import { User } from "../models/user.model.js";
import { generateJWT } from "../utils/generateJWT.js";

const { isEmail, isStrongPassword } = validator;

export const signup = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Email validation
    if (!email) {
      throw new Error("The email field is required!");
    }

    if (!isEmail(email)) {
      throw new Error("Invalid email!");
    }

    // Password validation
    if (!password) {
      throw new Error("The password field is required!");
    }

    if (!isStrongPassword(password)) {
      throw new Error("Password not strong enough!");
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

    // Hashes the password
    const hashed = bcrypt.hashSync(password, 10);

    // Creates the user
    const user = new User({ username: "", email, password: hashed, role });
    await user.save();

    // Generates the jwt
    const token = generateJWT({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Email validation
    if (!email) {
      throw new Error("The email field is required!");
    }

    if (!isEmail(email)) {
      throw new Error("Invalid email!");
    }

    // Password validation
    if (!password) {
      throw new Error("The password field is required!");
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found!");
    }

    // Verify password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password!");
    }

    // Generates the jwt
    const token = generateJWT({
      id: user._id,
      email: user.email,
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import validator from "validator";
import bcrypt from "bcrypt";
import { generate } from "generate-password";

import { User } from "../models/user.model.js";
import { generateJWT } from "../utils/generateJWT.js";

const { isEmail, isStrongPassword } = validator;

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

    // Role validation
    if (!role) {
      throw new Error("The role field is required!");
    }

    if (!(role === "admin" || role === "teacher" || role === "student")) {
      throw new Error("Invalid role!");
    }

    // Specialization validation
    if (role === "student") {
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
    console.log(`Password: `, password);
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

export const resetPassword = async (req, res) => {
  const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

  // Validate request body
  if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).send('All fields are required!');
  }

  // Check if new password matches confirmation
  if (newPassword !== confirmNewPassword) {
    return res.status(400).send('New passwords do not match!');
  }
  //Check if the new password is strong
  if (!isStrongPassword(newPassword)) {
    return res.status(400).send('Password not strong enough!');
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found!');
    }

    // Validate the old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).send('Old password is incorrect!');
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).send('Password reset successfully!');
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).send('Internal server error');
  }
};
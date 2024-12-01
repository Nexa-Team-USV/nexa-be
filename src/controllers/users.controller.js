import validator from "validator";
import bcrypt from "bcrypt";
import { generate } from "generate-password";

import { User } from "../models/user.model.js";
import { decodeJWT } from "../utils/decodeJWT.js";

const { isEmail, isStrongPassword } = validator;

export const createAccount = async (req, res) => {
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

export const getCurrentUser = async (req, res) => {
  const headers = req.headers;

  try {
    const userId = decodeJWT(headers.authorization.split(" ")[1]).id;

    const query = await User.findById(userId);

    const user = {
      _id: query._id,
      username: query.username,
      email: query.email,
      specialization: query.specialization,
      group: query.group,
      role: query.role,
      createdAt: query.createdAt,
    };

    if (!user) {
      throw new Error("User not found!");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const headers = req.headers;

  try {
    // Validate old password
    if (!oldPassword) {
      throw new Error("The old password field is required!");
    }

    // Validate new password
    if (!newPassword) {
      throw new Error("The new password field is required!");
    }

    // Validate confirmed new password
    if (!confirmNewPassword) {
      throw new Error("The confirm new password field is required!");
    }

    //Check if the new password is strong
    if (!isStrongPassword(newPassword)) {
      throw new Error("Password not strong enough!");
    }

    // Check if new password matches confirmation
    if (newPassword !== confirmNewPassword) {
      throw new Error("New passwords do not match!");
    }

    const userId = decodeJWT(headers.authorization.split(" ")[1]).id;

    // Find the user by email
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found!");
    }

    // Validate the old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      throw new Error("Old password is incorrect!");
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeAccount = async (req, res) => {
  const userEmail = req.body.email;

  try {
    const deleteUser = await User.findOneAndDelete({ email: userEmail });
    if (!deleteUser) throw new Error("User not found!");
    res.status(200).json({ message: "Account deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editProfile = async (req, res) => {
  const { newUsername, newSpecialization, newGroup } = req.body;
  console.log({ newUsername, newSpecialization, newGroup });
  const headers = req.headers;

  try {
    const userId = decodeJWT(headers.authorization.split(" ")[1]).id;

    // Find the user by email
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found!");
    }

    // Prepare fields to update
    const updatedFields = {};

    if (newUsername && newUsername !== user.username) {
      updatedFields.username = newUsername;
    }

    if (newSpecialization && newSpecialization !== user.specialization) {
      updatedFields.specialization = newSpecialization;
    }

    if (newGroup && newGroup !== user.group) {
      updatedFields.group = newGroup;
    }

    if (Object.keys(updatedFields).length === 0) {
      throw new Error("No fields to update!");
    }

    // Update the user's profile
    await User.findByIdAndUpdate(userId, {
      username: newUsername,
      specialization: newSpecialization,
      group: newGroup,
    });

    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

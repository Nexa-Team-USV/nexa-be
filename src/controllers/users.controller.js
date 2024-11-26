import validator from "validator";
import bcrypt from "bcrypt";

import { User } from "../models/user.model.js";
import { decodeJWT } from "../utils/decodeJWT.js";

const { isEmail, isStrongPassword } = validator;

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
  const userId = req.params.id;

  try {
    const deleteUser = await User.findByIdAndDelete(userId);
    if (!deleteUser) throw new Error("User not found!");
    res.status(200).json({ message: "Account deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

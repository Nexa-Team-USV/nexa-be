import validator from "validator";
import bcrypt from "bcrypt";
import { generate } from "generate-password";

import { User } from "../models/user.model.js";
import { decodeJWT } from "../utils/decodeJWT.js";

const { isEmail, isStrongPassword } = validator;

export const createAccount = async (req, res) => {
  const { email, studyType, group, role } = req.body;

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

    // Study type validation
    if (role === "student") {
      if (!studyType) {
        throw new Error("The study type field is required!");
      }

      if (!(studyType === "licenta" || studyType === "master")) {
        throw new Error("Invalid study type!");
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
    if (role === "admin" || role === "teacher") {
      await User.create({
        username: "",
        email,
        password: hashed,
        studyType: "",
        group: "",
        role,
      });

      return res.status(201).json({ message: "User created successfully!" });
    }

    await User.create({
      username: "",
      email,
      password: hashed,
      studyType,
      group,
      role,
    });

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  const headers = req.headers;

  try {
    const userId = decodeJWT(headers.authorization.split(" ")[1]).id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new Error("User not found!");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  const headers = req.headers;
  const role = req.params.role;
  const limit = req.query.limit;
  const offset = req.query.offset;

  try {
    const userId = decodeJWT(headers.authorization.split(" ")[1]).id;

    const users = await User.find({ role }).select("-password");

    const result = users
      .filter((user) => user.id !== userId)
      .slice(limit * (offset - 1), limit * offset);

    res
      .status(200)
      .json({ users: result, pages: Math.ceil(result.length / limit) });
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
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) throw new Error("User not found!");
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editProfile = async (req, res) => {
  const { newUsername, newStudyType, newGroup } = req.body;
  const headers = req.headers;

  try {
    const decodedToken = decodeJWT(headers.authorization.split(" ")[1]);
    const userId = decodedToken.id;
    const userRole = decodedToken.role;

    // Find the user by id
    const user = await User.findById(userId);

    const { username, studyType, group } = user;

    if (!user) {
      throw new Error("User not found!");
    }

    // Study type validation
    if (newUsername.length > 20) {
      throw new Error("The username shouldn't be longer than 20 characters!");
    }

    // Study type validation
    if (userRole === "student") {
      if (
        newStudyType &&
        !(newStudyType === "licenta" || newStudyType === "master")
      ) {
        throw new Error("Invalid study type!");
      }
    }

    // Prepare fields to update
    const updatedFields = {};

    if (newUsername && newUsername !== user.username) {
      updatedFields.username = newUsername;
    }

    if (newStudyType && newStudyType !== user.specialization) {
      updatedFields.specialization = newStudyType;
    }

    if (newGroup && newGroup !== user.group) {
      updatedFields.group = newGroup;
    }

    if (Object.keys(updatedFields).length === 0) {
      throw new Error("No fields to update!");
    }

    // Update the user's profile
    await User.findByIdAndUpdate(userId, {
      username: newUsername || username,
      studyType: newStudyType || studyType,
      group: newGroup || group,
    });

    // Find the updated user
    const updatedUser = await User.findById(userId).select("-password");

    res
      .status(200)
      .json({ user: updatedUser, message: "Profile updated successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

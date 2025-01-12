import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { generateJWT } from "../utils/generateJWT.js";
import { forgotPasswordTemplate } from "../mail/forgot.password.template.js";
import { transporter } from "../mail/mail.transporter.js";

const { isEmail, isStrongPassword } = validator;

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
      role: user.role,
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email
    if (!email) {
      throw new Error("Email field is required!");
    }

    if (!isEmail(email)) {
      throw new Error("Invalid email!");
    }
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found!");
    }

    // Generate a token valid for 10 min
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    // Send token to user's email
    const resetLink = `${process.env.CLIENT_URL}/reset-forgot-password?token=${resetToken}`;
    const emailHtml = forgotPasswordTemplate({ resetLink });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Link",
      html: emailHtml,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        throw new Error("Failed to send email. Please try again later.");
      } else
        res.status(200).json({
          message: "Password reset token sent to your email.",
        });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const resetForgotPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.query; // Get the token from the query parameters

  try {
    // Verify the token and extract the userId from it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // Extract the userId from the decoded token

    // Validate input
    if (!password) {
      throw new Error("The new password field is required!");
    }

    if (!confirmPassword) {
      throw new Error("The confirm new password field is required!");
    }

    // Check if the new passwords match
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match!");
    }

    // Check if the new password is strong
    if (!isStrongPassword(password)) {
      throw new Error("Password not strong enough!");
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully! You can now log in with your new password.",
    });
  } catch (error) {
    // Handle specific errors
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "Token has expired. Please request a new password reset.",
      });
    }

    // Handle other error types by using the error message
    res.status(400).json({ success: false, message: error.message });
  }
};

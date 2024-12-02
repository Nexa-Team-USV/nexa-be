import { User } from "../models/user.model.js";
import { Notification } from "../models/email.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASSWORD:", process.env.MAIL_PASSWORD);

// Endpoint for sending an email notification
export const sendEmail = async (req, res) => {
  const userId = req.params.id;
  try {
    // Fetch student and professor from the database
    const student = await User.findById(userId);
    const professor = await User.findById(userId);

    if (!student.role == "student" || !professor == "teacher") {
      return res.status(404).json({ message: "User or professor not found" });
    }

    // Configure the mailOptions object
    const mailOptions = {
      from: student.email,
      to: professor.email,
      subject: "Propunere de programare examen",
      text: `Studentul ${student.username} a propus un examen pentru grupa ${student.group}.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    // Save the notification in the database
    const notification = new Notification({
      user_id: student._id,
      message: mailOptions.text,
      status: "unread",
    });

    await notification.save();

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error fetching data or sending email:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

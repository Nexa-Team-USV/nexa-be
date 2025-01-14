import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Crearea unui obiect transporter folosind Gmail SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: process.env.SMTP_PORT,
  secure: false, // true pentru 465, false pentru alte porturi
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Funcție pentru verificarea conexiunii SMTP
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("Conexiune SMTP verificată cu succes");
  } catch (error) {
    console.error("Eroare de verificare SMTP:", error);
    throw error;
  }
};

verifyTransporter();

// Endpoint pentru trimiterea notificărilor prin email
export const sendExamProposalEmail = async (req, res) => {
  const { studentId } = req.body;

  // Validarea câmpurilor necesare
  if (!studentId) {
    return res.status(400).json({
      message: "studentId  este necesar",
    });
  }

  try {
    // Fetch student și validare rol
    const student = await User.findOne({
      _id: studentId,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({ message: "Studentul nu a fost găsit" });
    }

    // Căutăm profesorul care predă materia aleasă
    const professor = await User.findOne({
      role: "teacher",
    });

    if (!professor) {
      return res.status(404).json({
        message: "Profesorul nu a fost găsit pentru materia selectată",
      });
    }

    // Configurarea opțiunilor pentru email
    const mailOptions = {
      from: process.env.MAIL_USER, // Folosim email-ul aplicației
      to: professor.email,
      subject: `Propunere de examen `,
      text: `Grupa ${student.group} a trimis o propunere de examen.`,
      html: `
        <p>Grupa <strong>${
          student.group
        }</strong> a trimis o propunere de examen.</p>
        <p>Student: ${student.username || "N/A"}</p>
        <p>Email student: ${student.email}</p>
      `,
    };

    // Trimiterea email-ului
    await transporter.sendMail(mailOptions);

    // Crearea notificării
    const notification = new Notification({
      userId: professor._id, // Folosim denumirea consistentă (userId)
      message: mailOptions.text,
      status: "unread",
      type: "exam_proposal",
      metadata: {
        studentId,
        groupId: student.group,
      },
    });

    await notification.save();

    res.status(200).json({
      message: "Email trimis și notificare creată cu succes",
    });
  } catch (error) {
    console.error("Eroare la trimiterea email-ului:", error);
    res.status(500).json({
      message: "Eroare internă a serverului",
      error: error.message,
    });
  }
};

import nodeMailer from "nodemailer";
import dotenv from "dotenv";
import { Conflict } from "./httpError";
import ejs from "ejs";
import path from "path";
import { randomInt } from "crypto";

dotenv.config();
const transporter = nodeMailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
// Render an EJS email template

const renderEmailTemplate = async (
  templateName: string,
  data: any
): Promise<string> => {
  const templatePath = path.resolve(
    process.cwd(),
    "apps",
    "proyecto-siga-backend",
    "src",
    "templates",
    "email",
    `${templateName}.ejs`
  );
  return ejs.renderFile(templatePath, data);
};

// send an email using nodemailer

export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  data: Record<string, any>
): Promise<void> => {
  try {
    const html = await renderEmailTemplate(templateName, data);
    await transporter.sendMail({
      from: `<${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    throw Conflict("Error enviando email", { details: error });
  }
};

export const generateSecurePassword = async (): Promise<string> => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(randomInt(0, chars.length));
  }
  return password;
};

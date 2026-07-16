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
  // Producción: esbuild bundlea todo a dist/main.js (raíz de dist/) y copia
  // los templates a dist/templates (ver "assets" en package.json del backend).
  // Desarrollo: tsx ejecuta este archivo directo desde src/utils/sendEmail.ts,
  // por lo que los templates están un nivel arriba, en src/templates.
  const templatesDir =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "templates")
      : path.resolve(__dirname, "..", "templates");

  const templatePath = path.join(templatesDir, "email", `${templateName}.ejs`);
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

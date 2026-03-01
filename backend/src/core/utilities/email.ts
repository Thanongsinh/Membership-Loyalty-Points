import nodemailer from "nodemailer";
import { config } from "./config";
import { logger } from "../logs/logger";

// Default to ethereal (fake SMTP) for dev. Configure real SMTP in config.yaml
const transporter = nodemailer.createTransport({
  host: (config as any).email?.host || "smtp.ethereal.email",
  port: (config as any).email?.port || 587,
  auth: {
    user: (config as any).email?.user || "",
    pass: (config as any).email?.pass || "",
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: (config as any).email?.from || '"Loyalty Points" <noreply@loyalty.com>',
      to,
      subject,
      html,
    });
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (err) {
    logger.error(`Email failed: ${err}`);
  }
}

export function welcomeEmail(name: string, email: string) {
  return sendEmail(email, "Welcome to Loyalty Points!", `
    <h2>Welcome, ${name}!</h2>
    <p>Your account has been created successfully.</p>
    <p>Start earning points and redeeming rewards today!</p>
  `);
}

export function pointsExpiryEmail(name: string, email: string, points: number, daysLeft: number) {
  return sendEmail(email, "Your Points Are Expiring Soon", `
    <h2>Hi ${name},</h2>
    <p><strong>${points} points</strong> will expire in <strong>${daysLeft} days</strong>.</p>
    <p>Use them before they're gone!</p>
  `);
}

export function tierUpgradeEmail(name: string, email: string, newTier: string) {
  return sendEmail(email, `Congratulations! You're now ${newTier}!`, `
    <h2>Hi ${name},</h2>
    <p>You've been upgraded to <strong>${newTier}</strong> tier!</p>
    <p>Enjoy your new benefits!</p>
  `);
}

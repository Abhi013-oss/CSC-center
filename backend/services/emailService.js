import nodemailer from 'nodemailer';

/**
 * Nodemailer SMTP Email Dispatcher
 */

const EMAIL_HOST = process.env.EMAIL_HOST || '';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587', 10);
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
const EMAIL_FROM = process.env.EMAIL_FROM || '"CSC Center" <noreply@csccenter.in>';

let transporter = null;

if (EMAIL_HOST && EMAIL_USER && EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    }
  });
}

export const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    throw new Error('Recipient email address is required.');
  }

  // Live SMTP Transport if configured
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: EMAIL_FROM,
        to,
        subject,
        html
      });
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('[emailService] SMTP send error:', err.message);
      throw err;
    }
  }

  // Safe Console Log Fallback in Development / Test Mode (Requirement 66 & 107)
  console.log(`[emailService - DEV SIMULATION] To: ${to} | Subject: "${subject}"`);
  return { success: true, messageId: `sim_${Date.now()}` };
};

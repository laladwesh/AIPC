const nodemailer = require('nodemailer');

// Outlook / Microsoft 365 SMTP (STARTTLS on 587)
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter.verify()
    .then(() => console.log(`Mailer ready: sending as ${process.env.EMAIL_USER}`))
    .catch((err) => console.error(
      'Mailer verification failed. If this is a 535 auth error, the Microsoft 365 tenant ' +
      'likely has SMTP AUTH/basic auth disabled for this mailbox and an app password or ' +
      'OAuth2 setup is needed instead of a plain password:',
      err.message
    ));
} else {
  console.warn('EMAIL_USER/EMAIL_PASS not set — outgoing email is disabled.');
}

const SIGNATURE = '\n\n—\n49th AIPC 2026 · IIT Guwahati\n\nRegards,\nCenter for Career Development\nIIT Guwahati';

const sendEmail = async (to, subject, text) => {
  const body = `${text}${SIGNATURE}`;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`\n[EMAIL SKIPPED - no credentials configured]\nTo: ${to}\nSubject: ${subject}\nBody: ${body}\n`);
    return;
  }

  await transporter.sendMail({
    from: `"49th AIPC 2026, IIT Guwahati" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: body
  });
};

module.exports = sendEmail;

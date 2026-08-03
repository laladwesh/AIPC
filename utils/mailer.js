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

const sendEmail = async (to, subject, text) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`\n[EMAIL SKIPPED - no credentials configured]\nTo: ${to}\nSubject: ${subject}\nBody: ${text}\n`);
    return;
  }

  await transporter.sendMail({
    from: `"AIPC Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });
};

module.exports = sendEmail;

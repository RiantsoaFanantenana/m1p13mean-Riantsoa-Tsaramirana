import nodemailer from 'nodemailer';

let transporter;

const initTransporter = async () => {
  if (!transporter) {
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
};

export const sendEmail = async (to, subject, text) => {
  await initTransporter();

  const info = await transporter.sendMail({
    from: '"Mall Admin" <noreply@mall.com>',
    to,
    subject,
    text
  });

  console.log(`✅ Email sent to ${to}`);
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
};

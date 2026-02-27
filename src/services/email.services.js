import nodemailer from 'nodemailer';
import fs from "fs";

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

export const sendInvoiceEmail = async (to, payement, pdfPath) => {
  console.log(`Preparing to send invoice email to ${to} for payement ID ${payement._id}`);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Mall Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: "Votre facture de paiement",
    text: `Bonjour ${payement.shop.shopName},\n\nVeuillez trouver ci-joint votre facture de paiement.`,
    attachments: [
      {
        filename: `invoice_${payement._id}.pdf`,
        content: fs.readFileSync(pdfPath),
      },
    ],
  });

  console.log(`✅ Invoice sent to ${to}`);
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

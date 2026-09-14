import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"CommerSale" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your CommerSale account",
    text: `Your verification code is ${otp}. This code will expire in 10 minutes.`,
  });
};

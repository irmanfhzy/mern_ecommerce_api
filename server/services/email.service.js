import nodemailer from "nodemailer";

import { getAppSetting } from "./appSetting.service.js";

import AppError from "../utils/AppError.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, otp) => {
  const appSetting = await getAppSetting();

  const from = appSetting?.appName
    ? `"${appSetting.appName}" <${process.env.EMAIL_USER}>`
    : process.env.EMAIL_USER;

  await transporter.sendMail({
    from,
    to: email,
    subject: "Verify your CommerSale account",
    text: `Your verification code is ${otp}. This code will expire in 10 minutes.`,
  });
};

export const sendPasswordResetEmail = async (email, otp) => {
  const appSetting = await getAppSetting();

  const from = appSetting?.appName
    ? `"${appSetting.appName}" <${process.env.EMAIL_USER}>`
    : process.env.EMAIL_USER;

  await transporter.sendMail({
    from,
    to: email,
    subject: "Reset your CommerSale password",
    text: `Your password reset code is ${otp}. This code will expire in 10 minutes.`,
  });
};

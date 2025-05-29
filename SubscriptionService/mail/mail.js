import { forgotPasswordMail, verificationMail, welcomeBackMail } from "./mailTemplate.js";
import nodemailer from "nodemailer";
import { config } from "dotenv";
config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

const sendMail = async (to, subject, html) => {
    try {
        return await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        });
    } catch (error) {
        console.error("Mail error:", error);
        throw new Error("Failed to send email");
    }
};

export const sendRegisterMail = (email, code) => 
    sendMail(
        email, 
        "Verify your email",
        verificationMail.replace("__CODE__", code)
    );

export const sendForgotPasswordMail = (email, resetLink) =>
    sendMail(
        email,
        "Reset Your Password",
        forgotPasswordMail.replace("__RESET_LINK__", resetLink)
    );

export const sendWelcomeBackMail = (email, dashboardLink) =>
    sendMail(
        email,
        "Welcome back!",
        welcomeBackMail.replace("__Dashboard_link__", dashboardLink)
    );

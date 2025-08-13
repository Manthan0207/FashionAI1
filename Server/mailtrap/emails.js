import { transporter, sender } from './mailtrap.config.js';
import {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    TWO_FA_VERIFICATION_EMAIL_TEMPLATE,
    CHANGE_EMAIL_VERIFICATION_TEMPLATE
} from './emailTemplates.js';

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const response = await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        });
        console.log("Email Sent Successfully", response);
    } catch (error) {
        console.error("Error Sending verification email:", error);
        throw new Error("Error Sending verification email");
    }
};

export const send2FAVerificationEmail = async (email, verificationToken) => {

    try {
        const response = await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Verify Your Email",
            html: TWO_FA_VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        })
        console.log("Email Sent Successfully", response);


    } catch (error) {
        console.error("Error Sending 2FA verification email:", error);
        throw new Error("Error Sending 2FA verification email");
    }
}

export const changeEmailVerification = async (email, verificationToken) => {
    try {
        const response = await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Verify Your Email",
            html: CHANGE_EMAIL_VERIFICATION_TEMPLATE.replace("{verificationCode}", verificationToken),
        })
        console.log("Email Sent Successfully", response);


    } catch (error) {
        console.error("Error in sending change mail verification code :", error);
        throw new Error("Error in sending change mail verification code");
    }

}

export const sendWelcomeEmail = async (email, username) => {
    const html = `
    <h1>Welcome to FashionAI</h1>
    <p>Hello <strong>${username}</strong>, we're excited to have you!</p>
  `;

    try {
        const response = await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Welcome to FashionAI",
            html,
        });
        console.log("Welcome Email Sent Successfully", response);
    } catch (error) {
        console.log("Error sending Welcome Email", error);
        throw new Error("Error sending Welcome Email");
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const response = await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        });
        console.log("Password reset email sent", response);
    } catch (error) {
        console.log("Error sending reset password email", error);
        throw new Error("Error sending password reset email");
    }
};

export const sendResetSuccessEmail = async (email) => {
    try {
        const response = await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        });
        console.log("Password reset success email sent", response);
    } catch (error) {
        console.log("Error sending password reset success email", error);
        throw new Error("Error sending password reset success email");
    }
};

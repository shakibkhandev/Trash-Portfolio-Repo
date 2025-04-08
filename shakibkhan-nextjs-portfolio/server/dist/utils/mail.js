"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordMailgenContent = exports.emailVerificationMailgenContent = exports.sendEmail = void 0;
const mailgen_1 = __importDefault(require("mailgen"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const winston_logger_1 = __importDefault(require("../logger/winston.logger"));
/**
 * Function to send email using Mailgen and Nodemailer
 * @param options - Email options containing recipient email, subject, and mailgen content
 */
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    // Initialize Mailgen instance with default theme and brand configuration
    const mailGenerator = new mailgen_1.default({
        theme: "default",
        product: {
            name: "Shakib Khan",
            link: "https://shakibkhan.vercel.app",
        },
    });
    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    // Generate an HTML email with the provided contents
    const emailHtml = mailGenerator.generate(options.mailgenContent);
    let transporter;
    if (process.env.NODE_ENV === "production") {
        // Create a Nodemailer transporter instance which is responsible to send a mail
        transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD,
            },
        });
    }
    else {
        transporter = nodemailer_1.default.createTransport({
            host: process.env.MAILHOG_SMTP_HOST || "localhost",
            port: Number(process.env.MAILHOG_SMTP_PORT || 1025), // Ensure port is treated as a number
        });
    }
    const mail = {
        from: "mdshakibkhan.dev@gmail.com", // Sender's email
        to: options.email, // Receiver's email
        subject: options.subject, // Subject of the email
        text: emailTextual, // Text version of the email
        html: emailHtml, // HTML version of the email
    };
    try {
        yield transporter.sendMail(mail);
    }
    catch (error) {
        // Fail silently rather than breaking the app
        winston_logger_1.default.error("Email service failed silently. Make sure you have provided your credentials in the .env file");
        winston_logger_1.default.error("Error: ", error);
    }
});
exports.sendEmail = sendEmail;
/**
 *
 * @param {string} username
 * @param {string} verificationUrl
 * @returns {Mailgen.Content}
 * @description It designs the email verification mail
 */
const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to our app! We're very excited to have you on board.",
            action: {
                instructions: "To verify your email please click on the following button:",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Verify your email",
                    link: verificationUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};
exports.emailVerificationMailgenContent = emailVerificationMailgenContent;
const forgotPasswordMailgenContent = (name, passwordResetUrl) => {
    return {
        body: {
            name: name,
            intro: "We got a request to reset the password of our account",
            action: {
                instructions: "To reset your password click on the following button or link:",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Reset password",
                    link: passwordResetUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};
exports.forgotPasswordMailgenContent = forgotPasswordMailgenContent;

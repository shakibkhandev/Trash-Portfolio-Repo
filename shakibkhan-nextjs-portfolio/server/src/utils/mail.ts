
import Mailgen, { Content } from "mailgen";
import nodemailer from "nodemailer";
import logger from "../logger/winston.logger";


// Define a type for the options parameter
interface SendEmailOptions {
  email: string;
  subject: string;
  mailgenContent: Content; // Import the Content type from mailgen to ensure proper structure
}

/**
 * Function to send email using Mailgen and Nodemailer
 * @param options - Email options containing recipient email, subject, and mailgen content
 */
export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  // Initialize Mailgen instance with default theme and brand configuration
  const mailGenerator = new Mailgen({
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
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
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
    await transporter.sendMail(mail);
  } catch (error) {
    // Fail silently rather than breaking the app
    logger.error(
      "Email service failed silently. Make sure you have provided your credentials in the .env file"
    );
    logger.error("Error: ", error);
  }
};

/**
 *
 * @param {string} username
 * @param {string} verificationUrl
 * @returns {Mailgen.Content}
 * @description It designs the email verification mail
 */
export const emailVerificationMailgenContent = (
  username: string,
  verificationUrl: string
) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app! We're very excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export const forgotPasswordMailgenContent = (
  name: string,
  passwordResetUrl: string
) => {
  return {
    body: {
      name: name,
      intro: "We got a request to reset the password of our account",
      action: {
        instructions:
          "To reset your password click on the following button or link:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

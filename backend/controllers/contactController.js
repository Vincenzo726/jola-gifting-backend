const nodemailer = require("nodemailer");
const ContactMessage = require("../models/ContactMessage");

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Add SMTP_HOST, SMTP_USER and SMTP_PASS to the backend environment variables."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: {
      user,
      pass,
    },
  });
};

const createContact = async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please provide your name, email and message.",
    });
  }

  const contact = await ContactMessage.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
  });

  const destination =
    process.env.CONTACT_TO_EMAIL || "jolagifting@jolagifting.com";

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: destination,
      replyTo: email.trim(),
      subject: `New Contact Message — ${name.trim()}`,

      text:
        `New message from Jola Gifting website\n\n` +
        `Name: ${name.trim()}\n` +
        `Email: ${email.trim()}\n\n` +
        `Message:\n${message.trim()}\n\n` +
        `Submitted: ${new Date().toISOString()}`,

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #18202b;">
          <h2>New Contact Message — Jola Gifting</h2>

          <p>
            <strong>Name:</strong>
            ${escapeHtml(name.trim())}
          </p>

          <p>
            <strong>Email:</strong>
            ${escapeHtml(email.trim())}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <div style="white-space: pre-wrap; padding: 16px; background: #fcf4e6; border-radius: 10px;">
            ${escapeHtml(message.trim())}
          </div>
        </div>
      `,
    });

    contact.emailSent = true;
    contact.emailError = "";

    await contact.save();

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Contact email error:", error);

    contact.emailSent = false;
    contact.emailError = error.message;

    await contact.save();

    return res.status(500).json({
      success: false,
      message:
        "Your message was received, but the email could not be delivered yet. Please try again later.",
    });
  }
};

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

module.exports = {
  createContact,
};
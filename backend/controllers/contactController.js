const ContactMessage = require("../models/ContactMessage");

const ZEPTO_API_URL =
  process.env.ZEPTO_API_URL ||
  "https://cpaas.zoho.com/v1.1/email";

const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name, email and message.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const contact = await ContactMessage.create({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      emailSent: false,
      emailError: "",
    });

    const destination =
      process.env.CONTACT_TO_EMAIL ||
      "jolagifting@jolagifting.com";

    const apiKey =
      process.env.ZEPTO_API_KEY;

    if (!apiKey) {
      throw new Error(
        "ZEPTO_API_KEY is missing from the backend environment variables."
      );
    }

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #18202b;">
        <h2>New Contact Message — Jola Gifting</h2>

        <p>
          <strong>Name:</strong>
          ${escapeHtml(cleanName)}
        </p>

        <p>
          <strong>Email:</strong>
          ${escapeHtml(cleanEmail)}
        </p>

        <p>
          <strong>Message:</strong>
        </p>

        <div
          style="
            white-space: pre-wrap;
            padding: 16px;
            background: #fcf4e6;
            border-radius: 10px;
          "
        >
          ${escapeHtml(cleanMessage)}
        </div>

        <p style="font-size: 12px; color: #777;">
          Submitted: ${new Date().toISOString()}
        </p>
      </div>
    `;

    console.log(
      "Sending Jola contact email through Zoho CPaaS API..."
    );

    const response = await fetch(ZEPTO_API_URL, {
      method: "POST",

      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": apiKey,
      },

      body: JSON.stringify({
        from: {
          address: "jolagifting@jolagifting.com",
          name: "Jola Gifting",
        },

        to: [
          {
            email_address: {
              address: destination,
              name: "Jola Gifting",
            },
          },
        ],

        reply_to: [
          {
            address: cleanEmail,
            name: cleanName,
          },
        ],

        subject:
          `New Contact Message — ${cleanName}`,

        htmlbody: htmlBody,

        textbody:
          `New message from Jola Gifting website\n\n` +
          `Name: ${cleanName}\n` +
          `Email: ${cleanEmail}\n\n` +
          `Message:\n${cleanMessage}`,
      }),
    });

    const responseText =
      await response.text();

    let data = {};

    try {
      data = JSON.parse(responseText);
    } catch {
      data = {
        raw: responseText,
      };
    }

    console.log(
      "Zoho CPaaS response:",
      response.status,
      data
    );

    if (!response.ok) {
      contact.emailSent = false;
      contact.emailError =
        data?.message ||
        data?.error ||
        responseText ||
        `Zoho API returned ${response.status}`;

      await contact.save();

      return res.status(500).json({
        success: false,
        message:
          "Your message was received, but the email could not be delivered yet.",
      });
    }

    contact.emailSent = true;
    contact.emailError = "";

    await contact.save();

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
    });

  } catch (error) {
    console.error(
      "Contact email error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Your message was received, but the email could not be delivered yet.",
    });
  }
};


function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


module.exports = {
  createContact,
};
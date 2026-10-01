const nodemailer = require("nodemailer");
const ContactMessage = require("../models/ContactMessage");


/* =========================================================
   CREATE SMTP TRANSPORTER
========================================================= */

const createTransporter = () => {
  const host =
    process.env.SMTP_HOST || "smtp.zeptomail.com";

  const port =
    Number(process.env.SMTP_PORT) || 587;

  const user =
    process.env.SMTP_USER || "emailapikey";

  const pass =
    process.env.SMTP_PASS;

  const secure =
    String(
      process.env.SMTP_SECURE || "false"
    ).toLowerCase() === "true";


  if (!pass) {
    throw new Error(
      "SMTP_PASS is missing. Add your ZeptoMail Password 1 to the Render environment variables."
    );
  }


  console.log("Creating ZeptoMail SMTP transporter:", {
    host,
    port,
    user,
    secure,
    from:
      process.env.SMTP_FROM ||
      "jolagifting@jolagifting.com",
    to:
      process.env.CONTACT_TO_EMAIL ||
      "jolagifting@jolagifting.com",
  });


  return nodemailer.createTransport({
    host,
    port,
    secure,

    auth: {
      user,
      pass,
    },

    /*
      Prevent the request from staying on
      "Sending..." forever if SMTP does not respond.
    */

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,

    /*
      Useful in Render logs while testing.
    */

    logger: true,
    debug: true,
  });
};


/* =========================================================
   CREATE CONTACT
========================================================= */

const createContact = async (req, res) => {
  try {

    const {
      name,
      email,
      message,
    } = req.body || {};


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide your name.",
      });
    }


    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide your email address.",
      });
    }


    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide your message.",
      });
    }


    const cleanName =
      name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanMessage =
      message.trim();


    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid email address.",
      });
    }


    /* =====================================================
       SAVE MESSAGE TO DATABASE FIRST
    ===================================================== */

    const contact =
      await ContactMessage.create({
        name: cleanName,
        email: cleanEmail,
        message: cleanMessage,
        emailSent: false,
        emailError: "",
      });


    console.log(
      `Contact message saved. ID: ${contact._id}`
    );


    /* =====================================================
       EMAIL DESTINATION
    ===================================================== */

    const destination =
      process.env.CONTACT_TO_EMAIL ||
      "jolagifting@jolagifting.com";


    /* =====================================================
       SEND EMAIL
    ===================================================== */

    try {

      const transporter =
        createTransporter();


      console.log(
        "Attempting to send contact email to:",
        destination
      );


      const mailResult =
        await transporter.sendMail({

          from:
            process.env.SMTP_FROM ||
            "jolagifting@jolagifting.com",

          to:
            destination,

          /*
            When Jola clicks Reply,
            it replies to the person who
            filled the form.
          */

          replyTo:
            cleanEmail,

          subject:
            `New Contact Message — ${cleanName}`,

          text:
            `New message from Jola Gifting website\n\n` +
            `Name: ${cleanName}\n` +
            `Email: ${cleanEmail}\n\n` +
            `Message:\n${cleanMessage}\n\n` +
            `Submitted: ${new Date().toISOString()}`,

          html: `
            <!DOCTYPE html>

            <html>
              <body
                style="
                  margin:0;
                  padding:0;
                  background:#f8f4ed;
                  font-family:Arial,Helvetica,sans-serif;
                  color:#18202b;
                "
              >

                <div
                  style="
                    max-width:650px;
                    margin:40px auto;
                    padding:24px;
                  "
                >

                  <div
                    style="
                      background:#ffffff;
                      border-radius:16px;
                      padding:32px;
                    "
                  >

                    <h2
                      style="
                        margin-top:0;
                        margin-bottom:24px;
                      "
                    >
                      New Contact Message —
                      Jola Gifting
                    </h2>


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
                        white-space:pre-wrap;
                        padding:18px;
                        background:#fcf4e6;
                        border-radius:12px;
                      "
                    >
                      ${escapeHtml(cleanMessage)}
                    </div>


                    <p
                      style="
                        margin-top:24px;
                        font-size:12px;
                        color:#777;
                      "
                    >
                      Submitted:
                      ${new Date().toISOString()}
                    </p>

                  </div>

                </div>

              </body>
            </html>
          `,
        });


      console.log(
        "ZeptoMail send successful:",
        mailResult.messageId
      );


      /* ===================================================
         UPDATE DATABASE SUCCESS
      =================================================== */

      contact.emailSent = true;
      contact.emailError = "";

      await contact.save();


      /* ===================================================
         RESPONSE
      =================================================== */

      return res.status(201).json({
        success: true,
        message:
          "Message sent successfully.",
      });


    } catch (emailError) {

      console.error(
        "Contact email error:",
        emailError
      );


      /* ===================================================
         SAVE EMAIL ERROR
      =================================================== */

      contact.emailSent = false;

      contact.emailError =
        emailError?.message ||
        "Unknown email error";

      await contact.save();


      /*
        The contact itself was successfully
        saved, but ZeptoMail failed.
      */

      return res.status(500).json({
        success: false,
        message:
          "Your message was received, but the email could not be delivered yet. Please try again later.",
        error:
          process.env.NODE_ENV === "production"
            ? undefined
            : emailError?.message,
      });
    }


  } catch (error) {

    console.error(
      "Create contact error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while processing your message.",
    });
  }
};


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  createContact,
};
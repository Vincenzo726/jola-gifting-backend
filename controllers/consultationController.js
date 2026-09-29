const Consultation = require("../models/Consultation");

const createConsultation = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      recipientName,
      occasion,
      hasGiftInMind,
      giftIdea,
      budget,
      notes,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !recipientName ||
      !occasion ||
      typeof hasGiftInMind !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required information.",
      });
    }

    if (hasGiftInMind && !giftIdea?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please tell us what gift you have in mind.",
      });
    }

    const consultation = await Consultation.create({
      fullName,
      email,
      phone,
      recipientName,
      occasion,
      hasGiftInMind,
      giftIdea: hasGiftInMind ? giftIdea : "",
      budget,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Consultation request submitted successfully.",
      consultation,
    });
  } catch (error) {
    console.error("Create consultation error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting your request.",
    });
  }
};

module.exports = {
  createConsultation,
};
const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    recipientName: {
      type: String,
      required: true,
      trim: true,
    },

    occasion: {
      type: String,
      required: true,
      trim: true,
    },

    hasGiftInMind: {
      type: Boolean,
      required: true,
    },

    giftIdea: {
      type: String,
      trim: true,
      default: "",
    },

    budget: {
      type: String,
      trim: true,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Consultation", consultationSchema);
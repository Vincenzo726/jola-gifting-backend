const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const consultationRoutes = require("./routes/consultationRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Allow your frontend to communicate with the backend
app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "https://jolagifting.com",
      "https://www.jolagifting.com",
    ],
  })
);

// Parse JSON request bodies
app.use(express.json());

// API health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Jola Gifting API is running.",
  });
});

// Consultation API — POST only
app.use("/api/consultations", consultationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Jola Gifting API running on port ${PORT}`);
});
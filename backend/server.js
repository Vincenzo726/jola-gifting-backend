const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.join(__dirname, ".env"),
});

const connectDB = require("./config/db");
const consultationRoutes = require("./routes/consultationRoutes");

const app = express();

connectDB();

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

app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Consultation API — POST only
app.use("/api/consultations", consultationRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Jola Gifting API is running.",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Jola Gifting API running on port ${PORT}`);
});
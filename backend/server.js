const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");
const consultationRoutes = require("./routes/consultationRoutes");

const app = express();

connectDB();

app.use(
  cors({
    origin: [
      "https://jolagifting.com",
      "https://www.jolagifting.com",
    ],
  })
);

app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// API
app.use("/api/consultations", consultationRoutes);

// Frontend fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Jola Gifting API running on port ${PORT}`);
});
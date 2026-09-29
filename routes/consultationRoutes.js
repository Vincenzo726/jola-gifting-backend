const express = require("express");
const {
  createConsultation,
} = require("../controllers/consultationController");

const router = express.Router();

router.post("/", createConsultation);

module.exports = router;
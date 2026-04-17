const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/chatbotController");

// POST /api/chatbot/message - Send a message and get AI response
router.post("/message", sendMessage);

module.exports = router;


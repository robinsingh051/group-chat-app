const express = require("express");

const msgController = require("../controllers/message-controller");

const router = express.Router();

// /users/mag => POST
router.post("/", msgController.postmsg);

module.exports = router;

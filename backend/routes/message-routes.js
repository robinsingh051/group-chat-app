const express = require("express");

const msgController = require("../controllers/message-controller");
const authenticationMiddleware = require("../util/authentication");

const router = express.Router();

// /msg/all => GET
router.get("/all", msgController.getAllMsgs);

// /msg => POST
router.post("/", authenticationMiddleware, msgController.postmsg);

module.exports = router;

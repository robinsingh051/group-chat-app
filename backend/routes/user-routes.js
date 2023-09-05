const express = require("express");

const userController = require("../controllers/user-controller");

const router = express.Router();

// /users/signUp => POST
router.post("/signUp", userController.postUsers);

module.exports = router;

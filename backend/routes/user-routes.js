const express = require("express");

const userController = require("../controllers/user-controller");

const router = express.Router();

// /users/signUp => POST
router.post("/signUp", userController.postUsers);

// users/logIn => POST
router.post("/logIn", userController.getUser);

module.exports = router;

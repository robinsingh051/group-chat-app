const express = require("express");

const userController = require("../controllers/user-controller");

const router = express.Router();

// /users/signUp => POST
router.post("/signUp", userController.postUser);

// users/logIn => POST
router.post("/logIn", userController.getUser);

// users.all => GET
router.get("/all", userController.getAllUsers);

module.exports = router;

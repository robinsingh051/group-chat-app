const express = require("express");

const groupController = require("../controllers/group-controller");
const authenticationMiddleware = require("../util/authentication");

const router = express.Router();

// /groups/adduser => POST
router.post("/:id/adduser", authenticationMiddleware, groupController.addUser);

// /groups/addgroup => POST
router.post("/addgroup", authenticationMiddleware, groupController.addGroup);

//  /groups/:id/users => GET
router.get("/:id/users", authenticationMiddleware, groupController.getUsers);

// /groups/all => GET
router.get("/all", authenticationMiddleware, groupController.getGroups);

// /groups/:id/msgs => GET
router.get("/:id/msgs", authenticationMiddleware, groupController.getAllMsgs);

// /groups/:id/msgs => POST
router.post("/:id/msgs", authenticationMiddleware, groupController.postmsg);

module.exports = router;

const express = require("express");

const groupController = require("../controllers/group-controller");
const authenticationMiddleware = require("../util/authentication");

const router = express.Router();

// /groups/:id/user => POST
router.post("/:id/user", authenticationMiddleware, groupController.addUser);

// /groups/:id/user => DELETE
router.delete(
  "/:id/user",
  authenticationMiddleware,
  groupController.deleteUser
);

// /groups/:id/makeadmin => PATCH
router.patch(
  "/:id/makeadmin",
  authenticationMiddleware,
  groupController.makeadmin,
  groupController.getUsers
);

// /groups/addgroup => POST
router.post("/addgroup", authenticationMiddleware, groupController.addGroup);

//  /groups/:id/users => GET
router.get("/:id/users", authenticationMiddleware, groupController.getUsers);

// /groups/all => GET
router.get("/all", authenticationMiddleware, groupController.getGroups);

// /groups/:id/msgs => GET
// router.get("/:id/msgs", authenticationMiddleware, groupController.getAllMsgs);

// /groups/:id/msgs => POST
router.post("/:id/msgs", authenticationMiddleware, groupController.postmsg);

// /groups/:id/media => POST
router.post(
  "/:id/media",
  authenticationMiddleware,
  groupController.postmedia,
  groupController.postmsg
);

module.exports = router;

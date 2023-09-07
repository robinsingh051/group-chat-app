const User = require("../models/user");
const Msg = require("../models/message");
const Group = require("../models/group");
const userGroup = require("../models/userGroup");
const sequelize = require("../util/database");
const Sequelize = require("sequelize");

exports.addUser = async (req, res, next) => {
  const userId = req.user.id;
  const groupId = req.params.id;
  const userEmail = req.body.userEmail;
  try {
    const userToBeAdded = await User.findOne({ where: { email: userEmail } });
    if (userToBeAdded == null) res.status(404).json({ err: "User not found" });
    try {
      await userGroup.create({ userId: userToBeAdded.id, groupId: groupId });
      res.status(201).json({ user: userToBeAdded });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: "Server error" });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.addGroup = async (req, res, next) => {
  const userId = req.user.id;
  const groupname = req.body.groupname;
  //   console.log(userId, groupname);
  const t = await sequelize.transaction();
  try {
    const group = await Group.create(
      {
        name: groupname,
      },
      { transaction: t }
    );
    console.log(group.id);
    await userGroup.create(
      { userId: userId, groupId: group.id },
      { transaction: t }
    );
    await t.commit();
    res.status(201).json(group);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ err: "Server error" });
  }
};

exports.getUsers = async (req, res, next) => {
  const userId = req.user.id;
  const groupId = req.params.id;
  try {
    const users = await User.findAll({
      attributes: ["id", "name"],
      include: [
        {
          model: userGroup,
          where: { groupId: groupId },
        },
      ],
    });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Server error" });
  }
};

exports.getGroups = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const groups = await Group.findAll({
      attributes: ["name"],
      include: [
        {
          model: userGroup,
          where: { userId: req.user.id },
        },
      ],
    });
    console.log(groups);
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ err: "Not able to find user" });
  }
};

exports.getAllMsgs = async (req, res, next) => {
  try {
    const groupId = req.params.id;
    const lastMessageId = req.query.lastMessageId; // Get the lastMessageId from the query parameters
    const messages = await Msg.findAll({
      attributes: ["id", "msg", "createdAt"], // Select only the desired columns
      include: [
        {
          model: User,
          attributes: ["name"], // Include the username
        },
      ],
      where: {
        groupId: groupId,
        id: { [Sequelize.Op.gte]: lastMessageId }, // Filter messages by ID
      },
      order: [["createdAt"]], // Order by createdAt in descending order
    });

    // Format the response
    const formattedMessages = messages.map((message) => ({
      id: message.id,
      name: message.user.name,
      msg: message.msg,
      createdAt: message.createdAt,
    }));

    //console.log(formattedMessages);

    res.status(200).json(formattedMessages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Some error occurred" });
  }
};

exports.postmsg = async (req, res, next) => {
  const userId = req.user.id;
  const groupId = req.params.id;
  const msg = req.body.msg;
  console.log(msg);
  try {
    // Create a new message (Msg) record in the database
    const newMsg = await Msg.create({
      msg: msg,
      userId: req.user.id,
      groupId: groupId,
    });
    // Retrieve the user's name based on their userId
    const user = await User.findByPk(userId, {
      attributes: ["name"],
    });
    const responseMsg = {
      id: newMsg.id,
      name: user.name,
      msg: newMsg.msg,
      createdAt: newMsg.createdAt,
    };
    res.status(201).json({ msg: responseMsg });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Some error occured" });
  }
};

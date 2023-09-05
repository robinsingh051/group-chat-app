const Msg = require("../models/message");
const User = require("../models/user");
const sequelize = require("../util/database");

exports.postmsg = async (req, res, next) => {
  const msg = req.body.msg;
  console.log(msg);
  try {
    const newMsg = await Msg.create({
      msg: msg,
      userId: req.user.id,
    });
    const responseMsg = {
      name: req.user.name,
      msg: newMsg.msg,
      createdAt: newMsg.createdAt,
    };
    res.status(201).json({ msg: responseMsg });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Some error occured" });
  }
};

exports.getAllMsgs = async (req, res, next) => {
  try {
    const messages = await Msg.findAll({
      include: {
        model: User,
      },
    });

    console.log(messages);

    // Format the response
    const formattedMessages = messages.map((message) => ({
      name: message.user.name,
      msg: message.msg,
      createdAt: message.createdAt,
    }));

    res.status(200).json(formattedMessages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Some error occurred" });
  }
};

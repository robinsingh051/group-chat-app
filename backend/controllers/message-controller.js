const Msg = require("../models/message");
const User = require("../models/user");
const sequelize = require("../util/database");
const Sequelize = require("sequelize");

exports.postmsg = async (req, res, next) => {
  const msg = req.body.msg;
  console.log(msg);
  try {
    const newMsg = await Msg.create({
      msg: msg,
      userId: req.user.id,
    });
    const responseMsg = {
      id: newMsg.id,
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
    const lastMessageId = req.query.lastMessageId; // Get the lastMessageId from the query parameters
    // Define a filter condition to retrieve messages with an ID greater than or equal to lastMessageId
    const whereCondition = lastMessageId
      ? { id: { [Sequelize.Op.gte]: lastMessageId } }
      : {};

    const messages = await Msg.findAll({
      where: whereCondition, // Apply the filter condition
      include: {
        model: User,
      },
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

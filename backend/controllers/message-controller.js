const Msg = require("../models/message");
const sequelize = require("../util/database");

exports.postmsg = async (req, res, next) => {
  const msg = req.body.msg;
  console.log(msg);
  try {
    const newMsg = await Msg.create({
      msg: msg,
      userId: req.user.id,
    });
    res.status(201).json({ msg: newMsg, username: req.user.name });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Some error occured" });
  }
};

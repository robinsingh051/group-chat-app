const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_KEY;

const User = require("../models/user");
const sequelize = require("../util/database");

exports.postUsers = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  console.log(name, email, password, phone);
  const t = await sequelize.transaction();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create(
      {
        name: name,
        email: email,
        password: hashedPassword,
        phone: phone,
      },
      { transaction: t }
    );
    await t.commit();
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res
      .status(409)
      .json({ error: "User with this email already exists" });
  }
};

exports.getUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res
        .status(401)
        .json({ error: "Incorrect password", success: false });
    } else {
      const token = jwt.sign(user.id, secretKey);
      return res.status(200).json({
        message: "User logged in successfully",
        success: true,
        token: token,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "An error occurred" });
  }
};

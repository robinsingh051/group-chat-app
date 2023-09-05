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

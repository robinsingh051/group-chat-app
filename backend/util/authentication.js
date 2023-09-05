const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_KEY;

const User = require("../models/user");

async function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  try {
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken;
    const user = await User.findByPk(userId);
    req.user = user;
    console.log(req.user.id);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = verifyToken;

const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Msg = sequelize.define("message", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  msg: Sequelize.STRING,
});

module.exports = Msg;

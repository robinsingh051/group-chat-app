const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const ArchivedChat = sequelize.define("archivedMessage", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  msg: Sequelize.STRING,
});

module.exports = ArchivedChat;

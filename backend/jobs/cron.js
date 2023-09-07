const CronJob = require("cron").CronJob;
const sequelize = require("../util/database");
const Sequelize = require("sequelize");
const Chat = require("../models/message");
const ArchivedChat = require("../models/archivedMessage");

const job = new CronJob("0 0 * * *", async function () {
  try {
    // Runs at midnight every day
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago

    // Find all chats created before yesterday
    const chats = await Chat.findAll({
      where: {
        createdAt: {
          [Sequelize.Op.lt]: yesterday,
        },
      },
    });

    // Bulk create archived chats
    await ArchivedChat.bulkCreate(chats);

    // Destroy original chats
    await Chat.destroy({
      where: {
        createdAt: {
          [Sequelize.Op.lt]: yesterday,
        },
      },
    });

    console.log("Chats archived successfully.");
  } catch (error) {
    console.error("Error archiving chats:", error);
  }
});

module.exports = job;

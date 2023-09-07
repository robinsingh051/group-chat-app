const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./util/database");
const userRoutes = require("./routes/user-routes");
const msgRoutes = require("./routes/message-routes");
const groupRoutes = require("./routes/group-routes");

const User = require("./models/user");
const Msg = require("./models/message");
const Group = require("./models/group");
const userGroup = require("./models/userGroup");

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/users", userRoutes);
app.use("/msg", msgRoutes);
app.use("/groups", groupRoutes);

User.hasMany(Msg);
Msg.belongsTo(User);

User.hasMany(userGroup);
userGroup.belongsTo(User);

Group.hasMany(userGroup);
userGroup.belongsTo(Group);

Group.hasMany(Msg);
Msg.belongsTo(Group);

// Sync the database models
sequelize
  .sync()
  .then(() => {
    // Start the server
    app.listen(process.env.PORT || 3000);
  })
  .catch((error) => {
    console.error(error);
  });

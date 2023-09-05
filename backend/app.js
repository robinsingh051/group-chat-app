const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./util/database");
const authenticationMiddleware = require("./util/authentication");
const userRoutes = require("./routes/user-routes");
const msgRoutes = require("./routes/message-routes");

const User = require("./models/user");
const Msg = require("./models/message");

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/users", userRoutes);
app.use("/msg", authenticationMiddleware, msgRoutes);

User.hasMany(Msg);

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

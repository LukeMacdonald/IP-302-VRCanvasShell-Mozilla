const { Sequelize, DataTypes } = require("sequelize");
const User = require("../models/user");
let sequelize;
const db = {};

sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "VRCanvasShell.db",
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.user = User(db, DataTypes);
db.sync = async () => {
  try {
    await db.sequelize.sync();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = db;

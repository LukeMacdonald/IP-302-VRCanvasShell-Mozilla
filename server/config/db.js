const { Sequelize, DataTypes } = require("sequelize");
const User = require("../models/user");
const CourseModal = require("../models/course");
const ModuleModal = require("../models/module");
const RoomModal = require("../models/room");
const ObjectModal = require("../models/object");

let sequelize;
const db = {};

sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "storage.db",
  logging: false,
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.user = User(db, DataTypes);
db.courses = CourseModal(db, DataTypes);
db.modules = ModuleModal(db, DataTypes);
db.rooms = RoomModal(db, DataTypes);
db.objects = ObjectModal(db, DataTypes);

// Table Associations

db.modules.belongsTo(db.courses, {
  foreignKey: "courseId",
  allowNull: false,
});

db.courses.hasMany(db.modules, {
  foreignKey: "courseId",
  allowNull: false,
});

db.rooms.belongsTo(db.modules, {
  foreignKey: "moduleId",
  allowNull: false,
});

db.modules.hasMany(db.rooms, {
  foreignKey: "moduleId",
});
db.objects.belongsTo(db.rooms, {
  foreignKey: "roomId",
  allowNull: false,
});

db.rooms.hasMany(db.objects, {
  foreignKey: "roomId",
  allowNull: false,
});

db.sync = async () => {
  try {
    await db.sequelize.sync();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = db;

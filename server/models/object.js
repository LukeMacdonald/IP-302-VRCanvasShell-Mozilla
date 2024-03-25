module.exports = (db, DataTypes) => {
  const Object = db.sequelize.define(
    "object",
    {
      objectId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      link: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      position: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      scale: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rotation: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { timestamps: false },
  );
  return Object;
};

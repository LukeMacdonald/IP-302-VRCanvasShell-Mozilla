module.exports = (db, DataTypes) => {
  const Room = db.sequelize.define(
    "room",
    {
      roomId: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { timestamps: false },
  );
  return Room;
};

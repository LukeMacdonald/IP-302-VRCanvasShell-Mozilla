module.exports = (db, DataTypes) => {
  const User = db.sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      token: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: false,
    },
  );
  return User;
};

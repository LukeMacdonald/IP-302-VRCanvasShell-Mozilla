module.exports = (db, DataTypes) => {
  const Module = db.sequelize.define(
    "module",
    {
      moduleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { timestamps: false },
  );
  return Module;
};

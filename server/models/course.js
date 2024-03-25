module.exports = (db, DataTypes) => {
  const Course = db.sequelize.define(
    "course",
    {
      courseId: {
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
  return Course;
};

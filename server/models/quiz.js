module.exports = (db, DataTypes) => {
  const Quiz = db.sequelize.define(
    "quiz",
    {
      token: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
      quizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      key: {
        type: DataTypes.TEXT,
      },
      submissionId: {
        type: DataTypes.INTEGER,
      },
      validationToken: {
        type: DataTypes.TEXT,
      },
    },
    { timestamps: false },
  );
  return Quiz;
};

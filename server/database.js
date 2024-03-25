var sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "VRCanvasShell.db";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// POST Method

exports.createQuizSubmission = async (token, quizID, courseID, apiKey) => {
  return new Promise((resolve, reject) => {
    const insert =
      "INSERT INTO quiz_submission (token, quiz, course, key) VALUES (?,?,?,?)";
    db.run(insert, [token, quizID, courseID, apiKey], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

exports.getQuizSubmission = async (token) => {
  return new Promise((resolve, reject) => {
    const command = "SELECT * FROM quiz_submission WHERE token == ? LIMIT 1";
    const params = [token];
    db.get(command, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// PUT Methods
exports.updateQuiz = async (token, submission, validation) => {
  return new Promise((resolve, reject) => {
    const insert =
      "UPDATE quiz_submission SET submission = ?, validation_token = ? WHERE token = ?";
    db.run(insert, [submission, validation, token], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

exports.deleteQuizSubmission = async (token) => {
  return new Promise((resolve, reject) => {
    const command = "DELETE FROM quiz_submission WHERE token == ?";
    db.run(command, [token], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

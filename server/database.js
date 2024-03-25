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

exports.createUserAccount = async (username, password, token) => {
  return new Promise((resolve, reject) => {
    const insert =
      "INSERT INTO user (username, password, token) VALUES (?, ?, ?)";
    db.run(insert, [username, password, token], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

exports.createCourse = async (course_id, course_name) => {
  return new Promise((resolve, reject) => {
    const insert = "INSERT INTO course (course_id, name) VALUES (?, ?)";
    db.run(insert, [course_id, course_name], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

exports.createModule = async (module_id, module_name, course_id) => {
  return new Promise((resolve, reject) => {
    const insert =
      "INSERT INTO module (module_id, course_id, name) VALUES (?,?,?)";
    db.run(insert, [module_id, course_id, module_name], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

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

exports.createRoomEntry = async (room_id, room_name, module_id) => {
  return new Promise((resolve, reject) => {
    const insert = "INSERT INTO room (room_id, name, module_id) VALUES (?,?,?)";
    db.run(insert, [room_id, room_name, module_id], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

exports.createObjectEntry = async (room_id, object) => {
  const scale = object.scale;
  const position = object.position;
  const rotation = object.rotation;

  return new Promise((resolve, reject) => {
    const insert =
      "INSERT INTO object (link, position, scale, rotation, room_id) VALUES (?,?,?,?,?)";
    db.run(
      insert,
      [object.link, position, scale, rotation, room_id],
      function (err) {
        if (err) {
          reject(err);
        }
        resolve();
      },
    );
  });
};

// GET Methods

exports.checkIfUserExists = async (username) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user WHERE username = ?";
    const params = [username];
    db.get(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

exports.checkIfCouseExists = async (course_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM course WHERE course_id = ?";
    const params = [course_id];
    db.get(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows !== undefined);
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

exports.getAllModules = async (course_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM module WHERE course_id = ?";
    const params = [course_id];
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

exports.getAllRoom = async (module_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM room WHERE module_id = ?";
    const params = [module_id];
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};
exports.getCourse = async (course_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM course WHERE course_id = ? LIMIT 1";
    const params = [course_id];
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};
exports.getAllObjects = async (room_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM object WHERE room_id = ?";
    const params = [room_id];
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

exports.getModule = async (module_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM module WHERE module_id = ?";
    const params = [module_id];
    db.get(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

exports.getRoom = async (room_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM room WHERE room_id = ?";
    const params = [room_id];
    db.get(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

exports.getAllRoomObjects = async (room_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM object WHERE room_id = ?";
    const params = [room_id];
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
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

exports.updateUserKey = async (username, token) => {
  return new Promise((resolve, reject) => {
    const update = "UPDATE user SET token = ? WHERE username = ?";
    db.run(update, [token, username], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

// Delete Methods
exports.deleteRoomObjects = async (room_id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM object WHERE room_id = ?";
    const params = [room_id];

    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(
          `Objects with room ID ${room_id} has been deleted successfully.`,
        );
      }
    });
  });
};

exports.deleteRoom = async (roomID) => {
  return new Promise((resolve, reject) => {
    const command = "DELETE FROM room WHERE room_id == ?";
    db.run(command, [roomID], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

exports.deleteModule = async (moduleID) => {
  return new Promise((resolve, reject) => {
    const command = "DELETE FROM module WHERE module_id == ?";
    db.run(command, [moduleID], function (err) {
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

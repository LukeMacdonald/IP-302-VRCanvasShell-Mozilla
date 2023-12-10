var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "VRCanvasShell.db"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.');
    }
});

exports.checkIfUserExists = async (username) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM user WHERE username = ?';
    const params = [username];
    db.get(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

exports.checkIfCouseExists = async (course_id)=> {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM course WHERE course_id = ?';
    const params = [course_id];
    db.get(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows!==undefined);
    });
  });

}

exports.createUserAccount = async (username, password, token) => {
  return new Promise((resolve, reject) => {
    const insert = 'INSERT INTO user (username, password, token) VALUES (?, ?, ?)';
    db.run(insert, [username, password, token], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

exports.createCourse = async (course_id, course_name)=>{
  return new Promise((resolve, reject) => {
    const insert = 'INSERT INTO course (course_id, name) VALUES (?, ?)';
    db.run(insert, [course_id, course_name], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

exports.createModule = async (module_id, module_name, course_id) => {
  return new Promise((resolve, reject) => {
    const insert = 'INSERT INTO module (module_id, course_id, name) VALUES (?,?,?)'  
    db.run(insert, [module_id, course_id, module_name], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

exports.getAllModules = async (course_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM module WHERE course_id = ?';
    const params = [course_id];
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });

}

exports.getAllRoom = async (module_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM room WHERE module_id = ?';
    const params = [module_id];
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}
exports.getCourse = async (course_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM course WHERE course_id = ? LIMIT 1';
    const params = [course_id];
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}
exports.getAllObjects = async (room_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM object WHERE room_id = ?';
    const params = [room_id];
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

exports.getModule = async (module_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM module WHERE module_id = ?';
    const params = [module_id];
    db.get(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });

}

exports.getRoom = async (room_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM room WHERE room_id = ?';
    const params = [room_id];
    db.get(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}
exports.createRoomEntry = async (room_id,room_name,module_id) => {
  return new Promise((resolve, reject) => {
    const insert = 'INSERT INTO room (room_id, name, module_id) VALUES (?,?,?)'  
    db.run(insert, [room_id, room_name, module_id], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

exports.createObjectEntry = async (room_id, object) => {
  
  const scale = object.scale;
  const position = object.position;
  const rotation = object.rotation; 
  
  return new Promise((resolve, reject) => {
    const insert = 'INSERT INTO object (link, position, scale, rotation, room_id) VALUES (?,?,?,?,?)'  
    db.run(insert, [object.link, position, scale, rotation, room_id], function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

exports.getAllRoomObjects = async (room_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM object WHERE room_id = ?';
    const params = [room_id];
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });

}

exports.deleteRoomObjects = async (room_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM object WHERE room_id = ?';
    const params = [room_id];
    
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(`Objects with room ID ${room_id} has been deleted successfully.`);
      }
    });
  });
}


// module.exports = db
const db = require("../database")

const handleServerError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'An error occurred' });
};

exports.createModule = async (req, res) => {
  try {
    const { moduleName, courseID, moduleID, courseName } = req.body;

    const courseExists = await checkIfCouseExists(courseID) 

    if (!courseExists){
      await createCourse(courseID, courseName)
    }

    await createModule(moduleID,moduleName,courseID)

  } catch (error) {
    handleServerError(res, error);
  }
};

exports.modules = async (req, res) => {
  try {
    const courseID = req.params.courseID;

    const modules = await getAllModules(courseID);
    

    if (modules === undefined){
      return res.status(404).send({ error: 'Course or modules not found' });
    }
    for (const module of modules) {
      module["rooms"] = await getAllRoom(module.module_id)
    }
    res.status(200).send(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

exports.module = async(req,res) => {
  try {
    const moduleID = parseInt(req.params.moduleID, 10);
    
    const module = await getModule(moduleID)
    

    if (module === undefined){
      return res.status(404).send({ error: 'Modules not found' });
    } 

    const rooms = await getAllRoom(moduleID)
    
    const data = {
      "rooms": rooms,
      "name": module.name
    }

    res.status(200).send(data);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).send({ error: 'Internal server error' });
  }

}

exports.room = async(req,res) => {
  try {
    const roomID = req.params.roomID;
    const room  = await getRoom(roomID);
    res.status(200).send(room);
  } catch (error) {
    console.error('Error fetching room', error);
    res.status(500).send({ error: 'Internal server error' });
  }
}

exports.linkAccount = async (req, res) => {
  try {
    const userExists = await checkIfUserExists(req.body.id);

    if (userExists !== undefined) {
      res.status(400).json({ error: 'Account already exists' });
      return;
    }

    await createUserAccount(req.body.id, req.body.password, req.body.token);

    res.status(200).json({ message: 'Account Successfully Linked' });
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.authenticate = async (req, res) => {
  try {

    const userExists = await checkIfUserExists(req.params.id);

    if (userExists !== undefined) {
      if (userExists.password === req.params.password) {
        res.status(200).send({ token: userExists.token });
      }
      else{
        res.status(401).json({ error: 'Invalid password' });
      }
    }
    else{

      res.status(404).json({ error: 'Account not found' });
      return;
    }
  
  } catch (error) {
    handleServerError(res, error);
  }
};

function checkIfUserExists(username) {
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

function checkIfCouseExists(course_id){
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

function createUserAccount(username, password, token) {
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

function createCourse(course_id, course_name){
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

function createModule(module_id, module_name, course_id){
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

function getAllModules(course_id){
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

function getAllRoom(module_id){
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

function getModule(module_id){
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

function getRoom(room_id){
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



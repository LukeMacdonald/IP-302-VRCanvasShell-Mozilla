const config = require('../config/config.js');

const handleServerError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'An error occurred' });
};

exports.course = async (req, res) => {
  try {
    const courseID = req.params.courseID;
    const jsonData = config.loadJSONData('data.json');
    const courseData = jsonData[courseID];

    if (courseData) {
      res.json(courseData);
    } else {
      res.status(404).json({ error: 'Course not found' });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.saveCourse = async (req, res) => {
  try {
    const { data, courseID } = req.body;
    const jsonData = config.loadJSONData('data.json');

    // Update the data
    jsonData[courseID] = data;

    config.saveJSONData(jsonData, 'data.json');

    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.deleteRoom = (req, res) => {
  try {
    const roomID = req.params.roomID;
    const jsonData = config.loadJSONData('data.json');

    if (deleteRoomByRoomID(jsonData, roomID)) {
      config.saveJSONData(jsonData, 'data.json');
      res.status(200).send('Room deleted successfully.');
    } else {
      res.status(404).send('Room with the specified ID not found.');
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.createModule = async (req, res) => {
  try {
    const { moduleName, courseID, moduleID } = req.body;
    const jsonData = config.loadJSONData('data.json');

    if (!jsonData[courseID].modules[moduleID]) {
      const moduleData = {
        name: moduleName,
        rooms: {}
      };

      // Add the new moduleData
      jsonData[courseID].modules[moduleID] = moduleData;

      // Write the updated data back to data.json
      config.saveJSONData(jsonData, 'data.json');

      res.json(jsonData);
    } else {
      res.status(400).json({ success: false, error: 'ModuleID already exists' });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.modules = async (req, res) => {
  try {
    const courseID = req.params.courseID;
    const jsonData = await config.loadJSONData('data.json');
    
    if (!jsonData[courseID] || !jsonData[courseID].modules) {
      return res.status(404).send({ error: 'Course or modules not found' });
    }
    
    const modules = jsonData[courseID].modules;
    res.status(200).send(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

exports.module = async(req,res) => {
  try {
    const courseID = req.params.courseID;
    const moduleID = req.params.moduleID;

    const jsonData = await config.loadJSONData('data.json');
    
    if (!jsonData[courseID] || !jsonData[courseID].modules) {
      return res.status(404).send({ error: 'Course or modules not found' });
    }
    const module = jsonData[courseID].modules[moduleID];
    res.status(200).send(module);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).send({ error: 'Internal server error' });
  }

}
exports.room = async(req,res) => {
  try {

    const courseID = req.params.courseID;
    const moduleID = req.params.moduleID;
    const roomID = req.params.roomID;
    const jsonData = await config.loadJSONData('data.json');
    
    if (!jsonData[courseID] || !jsonData[courseID].modules || !jsonData[courseID].modules[moduleID].rooms[roomID]) {
      return res.status(404).send({ error: 'Course, modules or room not found' });
    }
    const room = jsonData[courseID].modules[moduleID].rooms[roomID]
    res.status(200).send(room);
  } catch (error) {
    console.error('Error fetching room', error);
    res.status(500).send({ error: 'Internal server error' });
  }

}

exports.linkAccount = async (req, res) => {
  try {
    // Load existing user data
    let data = config.loadJSONData('users.json');

    // Check if the account already exists
    if (data.accounts[req.body.id]) {
      res.status(400).json({ error: 'Account already exists' });
      return;
    }

    // Create a new account entry
    data.accounts[req.body.id] = {
      password: req.body.password,
      token: req.body.token
    };

    // Save the updated user data
    config.saveJSONData(data, 'users.json');

    res.status(200).json({ message: 'Account Successfully Linked' });
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.authenticate = async (req, res) => {
  try {
    let data = config.loadJSONData('users.json');
    const account = data.accounts[req.params.id];
    if (!account) {
      // Account with the given id doesn't exist
      res.status(404).json({ error: 'Account not found' });
      return;
    }
    if (account.password === req.params.password) {
      res.status(200).send({ token: account.token });
    } else {
      // Password doesn't match
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};
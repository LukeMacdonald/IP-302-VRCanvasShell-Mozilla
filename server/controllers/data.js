'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');

// Load JSON data from a file
function loadJSONData(name) {
  try {
    const jsonData = fs.readFileSync(name, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error loading JSON data:", error);
    return {}; // Return an empty object or handle the error as appropriate
  }
}

// Save JSON data to a file
function saveJSONData(data, name) {
  fs.writeFileSync(name, JSON.stringify(data, null, 2), 'utf-8');
}

// Route for getting course details
router.get('/course/details/:courseID', async (req, res) => {
  try {
    const courseID = req.params.courseID;
    const jsonData = loadJSONData('data.json');
    const courseData = jsonData[courseID];

    if (courseData) {
      res.json(courseData);
    } else {
      res.status(404).json({ error: 'Course not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Route for saving course data
router.post('/course/save', async (req, res) => {
  try {
    const { data, courseID } = req.body;
    const parsedJson = loadJSONData('data.json');

    // Update the data
    parsedJson[courseID] = data;

    saveJSONData(parsedJson,'data.json');

    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error in /course/save:', error);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});

// Route for deleting a room
router.get('/room/delete/:roomID', (req, res) => {
  try {
    const roomID = req.params.roomID;
    const jsonData = loadJSONData('data.json');

    if (deleteRoomByRoomID(jsonData, roomID)) {
      saveJSONData(jsonData,'data.json');
      res.status(200).send('Room deleted successfully.');
    } else {
      res.status(404).send('Room with the specified ID not found.');
    }
  } catch (error) {
    console.error('Error in /room/delete:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Route for creating a module
router.post('/module/create', async (req, res) => {
  try {
    const { moduleName, courseID, moduleID } = req.body;
    const jsonData = loadJSONData('data.json');

    if (!jsonData[courseID].modules[moduleID]) {
      const moduleData = {
        name: moduleName,
        rooms: {}
      };

      // Add the new moduleData
      jsonData[courseID].modules[moduleID] = moduleData;

      // Write the updated data back to data.json
      saveJSONData(jsonData,'data.json');

      res.json(jsonData);
    } else {
      res.status(400).json({ success: false, error: 'ModuleID already exists' });
    }
  } catch (error) {
    console.error('Error in /module/create:', error);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});

router.post('/account/link', async (req, res) => {
  try {
    // Load existing user data
    let data = loadJSONData("users.json");

    // Check if the account already exists
    if (data[req.body.id]) {
      res.status(400).json({ error: 'Account already exists' });
      return;
    }

    // Create a new account entry
    data[req.body.id] = {
      password: req.body.password,
      token: req.body.token
    };

    // Save the updated user data
    saveJSONData(data, "users.json");

    res.status(200).json({ message: 'Account Successfully Linked' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/account/auth/:id/:password', async (req, res) => {
  try {
    let data = loadJSONData("users.json");
    const account = data[req.params.id];
    

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
    res.status(500).json({ error: 'Login Failed' });
  }
});
module.exports = router;

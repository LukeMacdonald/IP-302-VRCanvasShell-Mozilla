'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');

// Load JSON data from a file
function loadJSONData() {
  try {
    const jsonData = fs.readFileSync('data.json', 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error loading JSON data:", error);
    return {}; // Return an empty object or handle the error as appropriate
  }
}

// Save JSON data to a file
function saveJSONData(data) {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8');
}

// Route for getting course details
router.get('/course/details/:courseID', async (req, res) => {
  try {
    const courseID = req.params.courseID;
    const jsonData = loadJSONData();
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
    const parsedJson = loadJSONData();

    // Update the data
    parsedJson[courseID] = data;

    saveJSONData(parsedJson);

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
    const jsonData = loadJSONData();

    if (deleteRoomByRoomID(jsonData, roomID)) {
      saveJSONData(jsonData);
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
    const jsonData = loadJSONData();

    if (!jsonData[courseID].modules[moduleID]) {
      const moduleData = {
        name: moduleName,
        rooms: {}
      };

      // Add the new moduleData
      jsonData[courseID].modules[moduleID] = moduleData;

      // Write the updated data back to data.json
      saveJSONData(jsonData);

      res.json(jsonData);
    } else {
      res.status(400).json({ success: false, error: 'ModuleID already exists' });
    }
  } catch (error) {
    console.error('Error in /module/create:', error);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});

module.exports = router;

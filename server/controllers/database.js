'use strict'

const express = require('express');
const router = express.Router();
const fs = require('fs');

function loadJSONData() {
  try {
      const jsonData = fs.readFileSync('data.json', 'utf-8');
      return JSON.parse(jsonData);
  } catch (error) {
      console.error("Error loading JSON data:", error);
      return {}; // Return an empty object or handle the error as appropriate
  }}
  
  // Save the data back to the JSON file
function saveJSONData(data) {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8');
};

router.get('/course/details/:courseID', async (req, res) => {
    try {
      const courseID = req.params.courseID
      const jsonData = loadJSONData();
  
      const courseJson = jsonData[courseID];
      // Use the parsedJson in your response or wherever needed
      return res.json(courseJson);
    }
    catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/course/save', async (req, res) => {
    try {
      const data = req.body.data;
      const courseID = req.body.courseID;
  
      // Read existing data from data.json
      const parsedJson = loadJSONData()
  
      // Update the data
      parsedJson[courseID] = data;
  
      saveJSONData(parsedJson);
  
      res.json({ success: true, message: 'Data saved successfully' });
    } catch (error) {
      console.error('Error in /course/save:', error);
      res.status(500).json({ success: false, error: 'An error occurred' });
    }
});

router.get('/room/delete/:roomID', (req, res) => {
    const roomID = req.params.roomID;
    const data = loadJSONData();
  
    if (deleteRoomByRoomID(data, roomID)) {
      saveJSONData(data);
      res.status(200).send('Room deleted successfully.');
    } else {
      res.status(404).send('Room with the specified ID not found.');
    }
});

// Endpoints for editing metadata stored on backend relating to mozilla hubs rooms
router.post('/module/create', async (req, res) => {
  try {
    const moduleName = req.body.moduleName;
    const courseID = req.body.courseID;
    const moduleID = req.body.moduleID;

    // Read existing data from data.json
    const parsedJson = loadJSONData()

    // Check if the moduleID already exists
    if (!parsedJson[courseID]["modules"][moduleID]) {
      const moduleData = {
        name: moduleName,
        rooms: {}
      };

      // Add the new moduleData
      parsedJson[courseID]["modules"][moduleID] = moduleData;

      // Write the updated data back to data.json
      saveJSONData(parsedJson)
      return res.json(parsedJson);
    } else {
      // If moduleID already exists, you can handle it accordingly
      return res.status(400).json({ success: false, error: 'ModuleID already exists' });
    }
  } catch (error) {
    console.error('Error in /module/create:', error);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});

module.exports = router;
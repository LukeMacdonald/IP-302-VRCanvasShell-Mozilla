const express = require("express");
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const cors = require("cors");
const fs = require('fs'); // Import the fs module
const fetch = require('node-fetch'); // Don't forget to require fetch
require('dotenv').config();
var https = require("https");
const app = express();
app.use(cors());
app.use(bodyParser.json());

const {
  CANVAS_API_KEY,
  HUBS_API_KEY,
  CANVAS_BASE_URL,
  HUBS_PUBLIC_URL,
} = process.env;

// Default PORT to 3000 if it is not defined
const PORT = process.env.PORT || 3000;

let bots = [];

// Function to create a bot
async function createBot(roomURL) {
  console.log('Launching puppeteer browser')
  const chromiumPath = '/usr/bin/chromium-browser'; // Replace with the actual path
  const headless = true; // Set to true for headless mode, or false for GUI mode

  const browser = await puppeteer.launch({
    executablePath: chromiumPath,
    headless: headless,
    args: ['--ignore-certificate-errors']
  });
  const page = await browser.newPage()

  // Enable permissions required
  const context = browser.defaultBrowserContext()
  context.overridePermissions(HUBS_PUBLIC_URL, ['microphone', 'camera'])
  context.overridePermissions(HUBS_PUBLIC_URL, ['microphone', 'camera'])

  // Create the room URL
  let parsedUrl = new URL(roomURL)
  parsedUrl.searchParams.set('bot', 'true')

  // Load the room
  console.log(`Bot joining room with URL: ${roomURL}`)
  await page.goto(parsedUrl.toString(), { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => NAF.connection.isConnected())
  return {page: page, browser: browser};

}

// Function to set bot name
async function setName(displayName) {
  try {
    window.APP.store.update({
      activity: {
        hasChangedName: true,
        hasAcceptedProfile: true,
      },
      profile: {
        displayName,

      }
    })
  } catch (error) {
    console.error('Error setting name:', error);
  }
}

// Function to create mozilla hubs room
async function createRoom(roomName) {
  // GraphQL endpoint for creating a room
  const graphqlEndpoint = HUBS_PUBLIC_URL + 'api/v2_alpha/graphiql';
  const query = `
    mutation {
        createRoom(sceneId:"3Hia68y", name: "${roomName}") {
          id,
          name,
          allowPromotion,
          memberPermissions{
            fly,
            spawnAndMoveMedia,
            pinObjects,
            voiceChat,
          },
          embedToken,
          creatorAssignmentToken,
          roomSize
        }
      }
    `;

    // Request options for GraphQL mutation
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + HUBS_API_KEY
      },
      body: JSON.stringify({ query })
    };
    try {
      const response = await fetch(graphqlEndpoint, requestOptions);
      return await response.json();
    }

    catch (error) {
      console.error('Error fetching GraphQL data:', error);
    }
}

/* API Endpoints */
// Fetch files for course from canvas
app.get('/files', async (req, res) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': req.headers['authorization']
    },
  }
  try {
    const endpoint = CANVAS_BASE_URL + `courses/${RMIT_COURSE_ID}/files`;
    const response = await fetch(endpoint, requestOptions);
    const data = await response.json();
    return res.json(data);;
  }
  catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Fetch files for course from canvas
app.get('/files/:courseID', async (req, res) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': req.headers['authorization']
    },
  }
  try {
    const courseID = req.params.courseID
    const endpoint = CANVAS_BASE_URL + `courses/${courseID}/files`;
    const response = await fetch(endpoint, requestOptions);
    const data = await response.json();

    // Common image file extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

    // Common 3D model file extensions
    const modelExtensions = ['.glb', '.gltf', '.obj', '.fbx'];

    // Additional allowed extensions
    const allowedExtensions = [
      ...imageExtensions,
      ...modelExtensions,
      '.pdf',
      '.mp4'
    ];

    // Filter files based on extensions
    const filteredFiles = data.filter(file => {
      const fileExtension = file.filename.split('.').pop().toLowerCase();
      return allowedExtensions.includes('.' + fileExtension);
    });

    return res.json(filteredFiles);
  }
  catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/room/create', async (req, res) => {
  try {

    const roomData = req.body;
    const notes = roomData.notes
    const objects = roomData.objects
    const roomName = roomData.roomName

    let roomURL = HUBS_PUBLIC_URL
    let botName = `VXBot_${bots.length}`;
    let roomID = ""

    try {
      // Create a Hubs room
      const room = await createRoom(roomName);

      if (room && room.data && room.data.createRoom) {
        roomID = room.data.createRoom.id
        roomURL += room.data.createRoom.id


        // Create a bot and set its name
        let {page, browser} = await createBot(roomURL);
        await page.evaluate(setName, botName, "tst message")

        // Store bot information
        bots.push(
          {
            id: botName,
            room_code: room.data.createRoom.id,
            page
          }
        );
        objects.map( async (object,index) => (
          await page.evaluate((object) => {
            const entity = document.createElement('a-entity');
            entity.setAttribute('media-loader', { src:object.url, fitToBox: true, resolve: true })
            entity.setAttribute('networked', { template: '#interactable-media'}) // Adjust position as needed
            entity.setAttribute('position', object.position)
            // entity.setAttribute("pinnable", {pinned: true})
            entity.setAttribute('scale', " 5 5 5")

            AFRAME.scenes[0].append(entity)
        },object)
        ))

      } else {
        console.error('Error: Unable to retrieve ID');
      }
    } catch (error) {
      console.error('Error fetching Canvas data:', error);
    }

    res.json({ url: roomURL,id: roomID });


  } catch (error) {
    console.error('Error in /spawn-room:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/data/:courseID', async (req, res) => {
  try {
    const courseID = req.params.courseID
    // Read data from data.json
    const jsonData = fs.readFileSync('data.json', 'utf-8');
    const parsedJson = JSON.parse(jsonData)[courseID];
    // Use the parsedJson in your response or wherever needed
    return res.json(parsedJson);
  }
  catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/course/save', async (req, res) => {
  try {
    const data = req.body.data;
    const courseID = req.body.courseID;

    // Read existing data from data.json
    const jsonData = fs.readFileSync('data.json', 'utf-8');
    const parsedJson = JSON.parse(jsonData);

    // Update the data
    parsedJson[courseID] = data;

    // Write the updated data back to data.json
    fs.writeFileSync('data.json', JSON.stringify(parsedJson, null, 2), 'utf-8');

    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error in /course/save:', error);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});

app.post('/reload-room', async (req, res) => {
  const moduleName = req.body.moduleName;
  const courseID = req.body.courseID;
  const roomID = req.body.roomID;
  let botName = `VXBot_${bots.length}`;
  const roomURL = HUBS_PUBLIC_URL + roomID


  let existingBot = bots.find(b => b.room_code === roomID);

  if (existingBot === undefined) {
    const jsonData = fs.readFileSync('data.json', 'utf-8');
    const courseData = JSON.parse(jsonData)[courseID];

    if (courseData) {
      const module = courseData.modules[moduleName];

      if (module) {
        const rooms = module.rooms;

        for (const roomType in rooms) {
          if (rooms.hasOwnProperty(roomType)) {
            const room = rooms[roomType];

            if (room.RoomID === roomID) {

              console.log("Found room with matching RoomID:");

              // Create a bot and set its name
              let {page, browser} = await createBot(roomURL);
              await page.evaluate(setName, botName, "tst message")
              // Store bot information
              bots.push({
                  id: botName,
                  room_code: roomID,
                  page
              });

              const objects = room.Objects;

              objects.map( async (object,index) => (
                await page.evaluate((object) => {

                  const entity = document.createElement('a-entity');
                  AFRAME.scenes[0].append(entity)
                  entity.setAttribute('media-loader', { src:object.url, fitToBox: true, resolve: true })
                  entity.setAttribute('networked', { template: '#interactable-media' }) // Adjust position as needed
                  entity.setAttribute('position', object.position)
                  entity.setAttribute("pinnable", {pinned: true})
                  entity.setAttribute('scale', " 3 3 3")
              },object)
              ));
              res.json({ url: roomURL });
            }
          }
        }
      } else {
        console.log(`Module ${moduleName} not found.`);
      }
    } else {
      console.log(`Course with ID ${courseID} not found.`);
    }
  } else {
    console.log(`Bot with room code ${roomID} already exists.`);
    res.json({ url: roomURL });
  }
});
   app.listen(PORT, function (){console.log("Welcome")})
// https.createServer(
//   {
//     key: fs.readFileSync("./certs/server.key"),
//     cert: fs.readFileSync("./certs/server.cert"),
//   },
//   app
//   )
//   .listen(PORT, function () {
//     console.log(
//       "Example app listening on port 3000! Go to https://localhost:3000/"
//     );
//   });

app.get('/course/teacher', async (req, res) => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      },
    }
    const endpoint = CANVAS_BASE_URL + `courses`;
    const response = await fetch(endpoint, requestOptions);
    const courses = await response.json();

    
    const studentCourses = courses.filter(course => {
      const studentEnrollments = course.enrollments.filter(enrollment => enrollment.type === 'teacher');
      return studentEnrollments.length > 0; // Include courses with student enrollments
    });


    res.status(200).json(studentCourses); // Optionally, send filtered courses as a response
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.get('/course/student', async (req, res) => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      },
    }

    const endpoint = CANVAS_BASE_URL + `courses`;
    const response = await fetch(endpoint, requestOptions);
    const courses = await response.json();

    const studentCourses = courses.filter(course => {
      const studentEnrollments = course.enrollments.filter(enrollment => enrollment.type === 'student');
      return studentEnrollments.length > 0; // Include courses with student enrollments
    });

    res.status(200).json(studentCourses); // Optionally, send filtered courses as a response
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.get('/modules/:courseID', async (req, res) => {
  try {
    const courseID = req.params.courseID;

    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      },
    }

    const endpoint = CANVAS_BASE_URL + `courses/${courseID}/modules`;
    const response = await fetch(endpoint,requestOptions);
    const modules = await response.json();

    res.status(200).json(modules);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.get('/modules/files/:courseID/:moduleID', async (req, res) => {
  try {
    const courseID = req.params.courseID;
    const moduleID = req.params.moduleID;

    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      },
    }


    const endpoint = CANVAS_BASE_URL + `courses/${courseID}/modules/${moduleID}/items`;
    const response = await fetch(endpoint, requestOptions);
    const items = await response.json();

    const files = [];

    for (const item of items) {
      const responseData = await fetch(item.url, req.headers);
      const file = await responseData.json();
      files.push(file);
    }
    // Common image file extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

    // Common 3D model file extensions
    const modelExtensions = ['.glb', '.gltf', '.obj', '.fbx'];

    // Additional allowed extensions
    const allowedExtensions = [
      ...imageExtensions,
      ...modelExtensions,
      '.pdf',
      '.mp4'
    ];

    // Filter files based on extensions
    const filteredFiles = files.filter(file => {
      const fileExtension = file.filename.split('.').pop().toLowerCase();
      return allowedExtensions.includes('.' + fileExtension);
    });
    res.status(200).json(filteredFiles);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.get('/course/:courseID', async(req, res) =>{
  try{
    const courseID = req.params.courseID;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization']
      },
    }
    const endpoint = CANVAS_BASE_URL + `courses/${courseID}`;
    const response = await fetch(endpoint, requestOptions);
    const course = await response.json();
    res.status(200).json(course); // Optionally, send filtered courses as a response
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
})

// Endpoints for editing metadata stored on backend relating to mozilla hubs rooms
app.post('/module/create', async (req, res) => {
  try {
    const moduleName = req.body.moduleName;
    const courseID = req.body.courseID;
    const moduleID = req.body.moduleID;

    // Read existing data from data.json
    const jsonData = fs.readFileSync('data.json', 'utf-8');
    const parsedJson = JSON.parse(jsonData);

    // Check if the moduleID already exists
    if (!parsedJson[courseID]["modules"][moduleID]) {
      const moduleData = {
        name: moduleName,
        rooms: {}
      };

      // Add the new moduleData
      parsedJson[courseID]["modules"][moduleID] = moduleData;

      // Write the updated data back to data.json
      fs.writeFileSync('data.json', JSON.stringify(parsedJson, null, 2), 'utf-8');

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

const loadJSONData = () => {
  const jsonData = fs.readFileSync('data.json', 'utf-8');
  return JSON.parse(jsonData);
};

// Save the data back to the JSON file
const saveJSONData = (data) => {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8');
};

// Delete a room by roomID
const deleteRoomByRoomID = (data, roomID) => {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const course = data[key];
      if (course.modules) {
        for (const moduleKey in course.modules) {
          if (course.modules.hasOwnProperty(moduleKey)) {
            const module = course.modules[moduleKey];
            if (module.rooms) {
              for (const roomKey in module.rooms) {
                if (module.rooms.hasOwnProperty(roomKey)) {
                  const room = module.rooms[roomKey];
                  if (room.RoomID === roomID) {
                    delete module.rooms[roomKey];
                    return true;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return false;
};

app.get('/room/delete/:roomID', (req, res) => {
  const roomID = req.params.roomID;
  const data = loadJSONData();

  if (deleteRoomByRoomID(data, roomID)) {
    saveJSONData(data);
    res.status(200).send('Room deleted successfully.');
  } else {
    res.status(404).send('Room with the specified ID not found.');
  }
});
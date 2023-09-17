'use strict'

const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
require('dotenv').config();

const HUBS_PUBLIC_URL = process.env.HUBS_PUBLIC_URL
const HUBS_API_KEY = process.env.HUBS_API_KEY

let deployedBots = [];

// Function to create a bot
async function createBot(roomURL) {
    console.log('Launching puppeteer browser')
    const chromiumPath = '/usr/bin/chromium-browser'; // Replace with the actual path
    const headless = true; // Set to true for headless mode, or false for GUI mode
  
    const browser = await puppeteer.launch({
      executablePath: chromiumPath,
      headless: headless,
      ignoreHTTPSErrors: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--ignore-gpu-blacklist", "--ignore-certificate-errors"]
    });
    const page = await browser.newPage()
    await page.setBypassCSP(true);
  
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
        createRoom(sceneId:"gjLg55z", name: "${roomName}") {
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

router.post('/room/create', async (req, res) => {
    try {
  
      const roomData = req.body; 
      const objects = roomData.objects
      const roomName = roomData.roomName
  
      let roomURL = HUBS_PUBLIC_URL
      let botName = `VXBot_${deployedBots.length}`;
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
          deployedBots.push(
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

router.post('/reload-room', async (req, res) => {
  const moduleName = req.body.moduleName;
  const courseID = req.body.courseID;
  const roomID = req.body.roomID;
  let botName = `VXBot_${deployedBots.length}`;
  const roomURL = HUBS_PUBLIC_URL + roomID


  let existingBot = deployedBots.find(b => b.room_code === roomID);

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
              deployedBots.push({
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

module.exports = router;
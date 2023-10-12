const puppeteer = require('puppeteer');

const fetch = require('node-fetch');

const fs = require('fs');

require('dotenv').config();

const { HUBS_PUBLIC_URL, loadJSONData, saveJSONData  } = require('../config/config');

const HUBS_API_KEY = process.env.HUBS_API_KEY

let bots = [];

// Function to create a bot
async function createBot(room, botName) {
  try {
    // Launch puppeteer browser
    const roomURL = `${HUBS_PUBLIC_URL}${room}`
    console.log('Launching puppeteer browser');
    const isProduction = process.env.NODE_ENV === 'production';

    const launchOptions = {
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--ignore-gpu-blacklist", "--ignore-certificate-errors"],
      headless: true,
      slowMo: 250
    };

    if (isProduction) {
      // Production configuration
      const chromiumPath = '/usr/bin/chromium-browser';
      launchOptions.executablePath = chromiumPath;
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Enable permissions required
    const context = browser.defaultBrowserContext();
    context.overridePermissions(HUBS_PUBLIC_URL, ['microphone', 'camera']);
    context.overridePermissions(HUBS_PUBLIC_URL, ['microphone', 'camera']);

    // Create the room URL
    let parsedUrl = new URL(roomURL);
    parsedUrl.searchParams.set('bot', 'true');

    // Load the room
    console.log(`Bot joining room with URL: ${roomURL}`);
    await page.goto(parsedUrl.toString(), { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => NAF.connection.isConnected(), { timeout: 60000 });

    // Set bot name
    await setName(page, botName);

    // Store bot information
    bots.push({
      id: botName,
      room_code: room,
      page,
    });

    return page;
  } catch (error) {
    console.error("Error creating bot:", error);
    throw error;
  }
}

// Function to set bot name
async function setName(page, displayName) {
  try {
    await page.evaluate((name) => {
      // Check if the necessary objects and functions exist before modifying the DOM
      if (typeof window !== 'undefined' && window.APP && window.APP.store && window.APP.store.update) {
        window.APP.store.update({
          activity: {
            hasChangedName: true,
            hasAcceptedProfile: true,
          },
          profile: {
            displayName: name,
          },
        });
      } else {
        throw new Error('Hubs page objects not found. Ensure you are on a valid Hubs page.');
      }
    }, displayName);
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

async function reloadRoom(roomID) {
  try {
    const botName = `VXBot_${bots.length}`;
    const roomURL = HUBS_PUBLIC_URL + roomID;
    const existingBot = bots.find((b) => b.room_code === roomID);

    if (existingBot === undefined) {
      // Create a new bot and add media to the room
      const jsonData = loadJSONData("data.json");
      const roomData = jsonData.rooms[roomID];
      const page = await createBot(roomID, botName);
      console.log(roomData);

      for (const object of roomData.Objects) {
        await addMediaToRoom(page, object.url,object.position );
      }

      return { url: roomURL };
    } else {
      console.log(`Bot with room code ${roomID} already exists.`);
      return { url: roomURL };
    }
  } catch (error) {
    console.error("Error reloading room:", error);
    throw error;
  }
}

exports.create = async (req, res) => {
  try {
    const courseID = req.body.courseID;
    const moduleID = req.body.moduleID;
    const roomData = req.body.data;
    const objects = roomData.objects;
    const roomName = roomData.roomName;
    let roomURL = HUBS_PUBLIC_URL;
    let botName = `VXBot_${bots.length}`;
    let roomID = "";

    // Create a Hubs room
    const room = await createRoom(roomName);

    if (room && room.data && room.data.createRoom) {
      roomID = room.data.createRoom.id;
      roomURL += room.data.createRoom.id;

      // Create a bot and set its name
      const page = await createBot(roomID, botName);

      for (const object of objects) {
        await addMediaToRoom(page, object.url,object.position );
      }

      const data = loadJSONData("data.json");
      data[courseID].modules[moduleID].rooms[roomName] = { RoomID: roomID, Objects: objects };
      data.rooms[roomID] = { Objects: objects };

      saveJSONData(data, "data.json");
    } else {
      console.error("Error: Unable to retrieve ID");
    }

    res.json({ url: roomURL, id: roomID });
  } catch (error) {
    console.error("Error in /spawn-room:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.reload = async (req, res) => {
  try {
    const roomID = req.body.roomID;
    const response = await reloadRoom(roomID);
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.reloadHubs = async(req,res) => {

  const roomID = req.body.roomID;
  let botName = `VXBot_${bots.length}`;
  const roomURL = HUBS_PUBLIC_URL + roomID

  let existingBot = bots.find(b => b.room_code === roomID);

  if (existingBot === undefined) {
    const jsonData = fs.readFileSync('data.json', 'utf-8');
    const roomData = JSON.parse(jsonData).rooms;
    const room = roomData[roomID];
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
    },object)));
              
    res.json({ url: roomURL });
  }
}

exports.moduleHome = async (req, res) => {
  try {
    const moduleID = req.params.moduleID;

    // Load module data from JSON
    const data = loadJSONData("newdata.json");
    const module = data.modules[moduleID];
    if (!module) {
      throw new Error(`Module with ID ${moduleID} not found`);
    }

    // Create a bot
    const botName = `VXBot_${bots.length}`;
    const page = await createBot(module.home, botName);

    // Use Promise.all to run the loop in parallel
    let x = 2
    await Promise.all(
      module.rooms.map(async (room) => {
        await reloadRoom(room);
        await addMediaToRoom(page, HUBS_PUBLIC_URL + room, `${x} 2 2`);
        x += 8;
      })
    );

    res.status(200).send("Bot setup completed successfully.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred during bot setup.");
  }
};

exports.edit= async (req, res) =>{
  try {
    const { courseID, moduleID, data, roomID } = req.body;
    const { objects, roomName } = data;
    const jsonData = loadJSONData("data.json");
    jsonData[courseID].modules[moduleID].rooms[roomName] = { RoomID: roomID, Objects: objects };
    jsonData.rooms[roomID] = { Objects: objects };
    saveJSONData(jsonData, "data.json");
    res.status(200).json({ message: "Room data updated successfully." });
  } catch (error) {
    console.error("Error updating room data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
} 

async function addMediaToRoom(page, content, position) {
  try {
    console.log(typeof page);
    const entity = await page.evaluate((content,position) => {
      const entity = document.createElement("a-entity");
      AFRAME.scenes[0].append(entity);
      entity.setAttribute("media-loader", { src: content, fitToBox: true, resolve: true });
      entity.setAttribute("networked", { template: "#interactable-media" });
      entity.setAttribute("position", `${position["x"]} ${position["y"]} ${position["z"]}`);

      entity.setAttribute("pinnable", { pinned: true });
      entity.setAttribute("scale", "5 5 5");
      return entity;
    }, content, position);

    return entity;
  } catch (error) {
    console.error("Error adding media to room:", error);
    throw error;
  }
}




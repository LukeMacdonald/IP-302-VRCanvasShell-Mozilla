const puppeteer = require("puppeteer");
const db = require("../database");

const fetch = require("node-fetch");

require("dotenv").config();

const { HUBS_PUBLIC_URL } = require("../config/config");

const HUBS_API_KEY = process.env.HUBS_API_KEY;

let bots = [];

// Function to create a bot
exports.createBot = async (room, botName) => {
  try {
    // Launch puppeteer browser
    const roomURL = `${HUBS_PUBLIC_URL}${room}`;
    console.log("Launching puppeteer browser");
    const isProduction = process.env.NODE_ENV === "production";

    const launchOptions = {
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--ignore-gpu-blacklist",
        "--ignore-certificate-errors",
      ],
      headless: false,
      slowMo: 250,
    };

    if (isProduction) {
      // Production configuration
      const chromiumPath = "/usr/bin/chromium-browser";
      launchOptions.executablePath = chromiumPath;
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Enable permissions required
    const context = browser.defaultBrowserContext();
    context.overridePermissions(HUBS_PUBLIC_URL, ["microphone", "camera"]);
    context.overridePermissions(HUBS_PUBLIC_URL, ["microphone", "camera"]);

    // Create the room URL
    let parsedUrl = new URL(roomURL);
    parsedUrl.searchParams.set("bot", "true");

    // Load the room
    console.log(`Bot joining room with URL: ${roomURL}`);
    await page.goto(parsedUrl.toString(), { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => NAF.connection.isConnected(), {
      timeout: 60000,
    });

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
};

// Function to set bot name
async function setName(page, displayName) {
  try {
    await page.evaluate((name) => {
      // Check if the necessary objects and functions exist before modifying the DOM
      if (
        typeof window !== "undefined" &&
        window.APP &&
        window.APP.store &&
        window.APP.store.update
      ) {
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
        throw new Error(
          "Hubs page objects not found. Ensure you are on a valid Hubs page.",
        );
      }
    }, displayName);
  } catch (error) {
    console.error("Error setting name:", error);
  }
}

// Function to create mozilla hubs room
exports.createRoom = async (roomName) => {
  // GraphQL endpoint for creating a room
  const graphqlEndpoint = HUBS_PUBLIC_URL + "api/v2_alpha/graphiql";
  const query = `
    mutation {
        createRoom(sceneId:"J7CuIPo", name: "${roomName}") {
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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + HUBS_API_KEY,
    },
    body: JSON.stringify({ query }),
  };
  try {
    const response = await fetch(graphqlEndpoint, requestOptions);
    return await response.json();
  } catch (error) {
    console.error("Error fetching GraphQL data:", error);
  }
};

async function reloadRoom(roomID) {
  try {
    const botName = `VXBot_${bots.length}`;
    const roomURL = HUBS_PUBLIC_URL + roomID;
    const existingBot = bots.find((b) => b.room_code === roomID);

    if (existingBot === undefined) {
      // Create a new bot and add media to the room
      const allObjects = await db.getAllRoomObjects(roomID);
      const page = await createBot(roomID, botName);

      for (const object of allObjects) {
        await addMediaToRoom(page, object);
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

async function deleteBot(roomID) {
  try {
    // Find the index of the bot with the given roomID in the bots array
    const botIndex = bots.findIndex((bot) => bot.room_code === roomID);

    // Check if the bot was found
    if (botIndex !== -1) {
      // Get the bot object
      const bot = bots[botIndex];

      // Close the browser associated with the bot
      await bot.page.browser().close();

      // Remove the bot from the bots array
      bots.splice(botIndex, 1);

      console.log(`Bot with room code ${roomID} has been deleted.`);
    } else {
      console.log(`Bot with room code ${roomID} not found.`);
    }
  } catch (error) {
    console.error("Error deleting bot:", error);
    throw error;
  }
}

async function addMediaToRoom(page, object) {
  try {
    console.log(object);
    const entity = await page.evaluate((object) => {
      const entity = document.createElement("a-entity");
      AFRAME.scenes[0].append(entity);
      entity.setAttribute("media-loader", {
        src: object.link,
        fitToBox: true,
        resolve: true,
      });
      entity.setAttribute("networked", { template: "#interactable-media" });
      entity.setAttribute("position", `${object.position}`);
      entity.setAttribute("scale", `${object.scale}`);
      entity.setAttribute("rotation", `${object.rotation}`);
      entity.setAttribute("pinnable", { pinned: false });
      return entity;
    }, object);

    return entity;
  } catch (error) {
    console.error("Error adding media to room:", error);
    throw error;
  }
}

async function retrieveObjects(page) {
  try {
    const objects = await page.evaluate(() => {
      try {
        const children = window.APP.scene.getChildEntities();
        const objects = [];

        children.forEach((child, index) => {
          if (child.components.hasOwnProperty("media-loader")) {
            objects.push({
              link: child.components["media-loader"].attrValue.src,
              position: `${child.object3D.position.x} ${child.object3D.position.y} ${child.object3D.position.z}`,
              scale: `${child.object3D.scale.x} ${child.object3D.scale.y} ${child.object3D.scale.z}`,
              rotation: `${child.object3D.rotation._x} ${child.object3D.rotation._y} ${child.object3D.rotation._z}`,
            });
          }
        });

        console.log("Successfully retrieved objects:", objects);
        return objects;
      } catch (e) {
        console.error("Error in page.evaluate:", e);
        throw e;
      }
    });

    console.log("Objects array outside page.evaluate:", objects);
    return objects;
  } catch (error) {
    console.error("Error retrieving objects from room.");
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
      await db.createRoomEntry(roomID, roomName, moduleID);

      // Create a bot and set its name
      const page = await createBot(roomID, botName);

      for (const object of objects) {
        await db.createObjectEntry(roomID, object);
        await addMediaToRoom(page, object);
      }
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
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.edit = async (req, res) => {
  try {
    const { data, roomID } = req.body;

    await db.deleteRoomObjects(roomID);

    const { objects } = data;

    for (const object of objects) {
      await db.createObjectEntry(roomID, object);
    }

    await deleteBot(roomID);
    await reloadRoom(roomID);
    res.status(200).json({ message: "Room data updated successfully." });
  } catch (error) {
    console.error("Error updating room data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.backup = async (req, res) => {
  try {
    const roomID = req.params.roomID;

    const botName = `VXBot_${bots.length}`;

    let page = null;

    const existingBot = bots.find((b) => b.room_code === roomID);
    if (existingBot === undefined) {
      page = await createBot(roomID, botName);
    } else {
      page = existingBot.page;
    }

    const objects = await retrieveObjects(page);

    await db.deleteRoomObjects(roomID);

    for (const object of objects) {
      await db.createObjectEntry(roomID, object);
    }
  } catch (error) {
    throw error;
  }
};

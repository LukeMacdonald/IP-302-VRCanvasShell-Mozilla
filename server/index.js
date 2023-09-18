'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204, // No content response for preflight requests
};
// Middleware
app.use(cors(corsOptions));

app.use(bodyParser.json());

require('dotenv').config();

puppeteer.use(StealthPlugin());

// Import and use routers
const dataController = require('./controllers/data');
const { router: canvasController, startBot } = require('./controllers/canvas');
const hubsController = require('./controllers/hubs');

app.use('/canvas', canvasController);
app.use('/hubs', hubsController);
app.use('/data', dataController);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Configuration
const PORT = process.env.PORT || 3000;

// Trigger the 'start-bot' GET request when the server is started
app.listen(PORT, () => {
  console.log(`HTTP Application listening on port ${PORT}!`);
  console.log(`Go to http://localhost:${PORT}/`);

  // Call the startBot function here
  startBot();
});
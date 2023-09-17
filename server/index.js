'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require("https");
const fs = require('fs');

// Middleware
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();

// Import and use routers
const dataController = require('./controllers/data');
const canvasController = require('./controllers/canvas');
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
const useHttps = process.argv.includes('--https');
const httpsOptions = {
  key: fs.readFileSync("./certs/server.key"),
  cert: fs.readFileSync("./certs/server.cert"),
};

// Start the server
if (useHttps) {
  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`HTTPS Application listening on port ${PORT}!`);
    console.log(`Go to https://client.canvas-hub.com:${PORT}/`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`HTTP Application listening on port ${PORT}!`);
    console.log(`Go to http://localhost:${PORT}/`);
  });
}
'use strict'
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs'); // Import the fs module


// Middleware
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();
var https = require("https");

// Import and use routers
const databaseRouter = require('./controllers/database');
const canvasRouter = require('./controllers/canvas');
const hubsRouter = require('./controllers/hubs');


app.use('/canvas', canvasRouter);
app.use('/hubs', hubsRouter);
app.use('/data', databaseRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});


// Default PORT to 3000 if it is not defined
const PORT = process.env.PORT || 3000;

// Check for a command line argument to determine whether to use HTTPS
const useHttps = process.argv.includes('--https');

if (useHttps) {
  https.createServer(
    {
      key: fs.readFileSync("./certs/server.key"),
      cert: fs.readFileSync("./certs/server.cert"),
    },
    app).listen(PORT, function () {
      console.log(`HTTPS Application listening on port ${PORT}! Go to https://client.canvas-hub.com:${PORT}/`);
    });
} 
else {
  app.listen(PORT, function () {
    console.log(`HTTP Application listening on port ${PORT}! Go to http://localhost:${PORT}/`);
  });
}
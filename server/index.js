const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const { CLIENT_URL, HUBS_PUBLIC_URL } = require('./config/config');

const clientCorsOptions = {
  origin: CLIENT_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204, // No content response for preflight requests
};

const hubsCorsOptions = {
  origin: HUBS_PUBLIC_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204, // No content response for preflight requests
};

// Middleware
// app.use(cors(clientCorsOptions)); // Use the client CORS options for the client URL
// app.use(cors(hubsCorsOptions));   // Use the hubs CORS options for the hubs URL

app.use(cors());

app.use(bodyParser.json());

require('dotenv').config();

// Add routes.
require('./routes/canvas-routes')(express, app);
require('./routes/hubs-routes')(express, app);
require('./routes/database-routes')(express, app);

// Configuration
const PORT = process.env.PORT || 3000;

// Trigger the 'start-bot' GET request when the server is started
app.listen(PORT, () => {
  console.log(`HTTP Application listening on port ${PORT}!`);
  console.log(`Go to http://localhost:${PORT}/`);
});
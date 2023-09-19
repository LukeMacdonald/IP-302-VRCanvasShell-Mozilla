const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const {CLIENT_URL} = require('./config/config')

const corsOptions = {
  origin: CLIENT_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204, // No content response for preflight requests
};

// Middleware
app.use(cors(corsOptions));

app.use(bodyParser.json());

require('dotenv').config();

// Add routes.
require("./routes/canvas-routes")(express, app);
require("./routes/hubs-routes")(express, app);
require("./routes/database-routes")(express, app);

// Configuration
const PORT = process.env.PORT || 3000;

// Trigger the 'start-bot' GET request when the server is started
app.listen(PORT, () => {
  console.log(`HTTP Application listening on port ${PORT}!`);
  console.log(`Go to http://localhost:${PORT}/`);
});
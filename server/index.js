const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database");

app.use(cors());

app.use(bodyParser.json());

require("dotenv").config();

// Add routes.
require("./routes/canvas-routes")(express, app);
require("./routes/hubs-routes")(express, app);
require("./routes/database-routes")(express, app);
require("./routes/quiz-routes")(express, app);
// Configuration
const PORT = process.env.PORT || 3000;

// Trigger the 'start-bot' GET request when the server is started
app.listen(PORT, () => {
  console.log(`HTTP Application listening on port ${PORT}!`);
  console.log(`Go to http://localhost:${PORT}/`);
});


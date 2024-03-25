const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const bodyParser = require("body-parser");

// Configuration
const PORT = process.env.PORT || 3000;

const db = require("./config/db");
db.sync();

app.use(cors());

app.use(bodyParser.json());

app.use(logger);

// Add routes.
app.use("/canvas", require("./routes/canvas-routes"));
app.use("/hubs", require("./routes/hubs-routes"));
app.use("/data", require("./routes/database-routes"));
app.use("/quiz", require("./routes/quiz-routes"));
app.use("/auth", require("./routes/auth"));

app.use(errorHandler);
// Trigger the 'start-bot' GET request when the server is started
app.listen(PORT, () => {
  console.log(`HTTP Application listening on port ${PORT}!`);
  console.log(`Go to http://localhost:${PORT}/`);
});

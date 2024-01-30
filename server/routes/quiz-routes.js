module.exports = (express, app) => {
  const controller = require("../controllers/quiz-controller");

  const router = express.Router();

  router.get("/questions", controller.init);

  app.use("/quiz", router);
};

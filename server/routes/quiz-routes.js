module.exports = (express, app) => {
  const controller = require("../controllers/quiz-controller");

  const router = express.Router();

  router.post('/spawn/:courseID/:quizID', controller.spawn)

  router.get("/questions/:token", controller.init);

  router.post("/submit/:quizID", controller.submit);

  app.use("/quiz", router);
};

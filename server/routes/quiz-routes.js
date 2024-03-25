const express = require("express");
const controller = require("../controllers/quiz-controller");

const router = express.Router();

router.post("/spawn/:courseID/:quizID", controller.spawn);

router.get("/questions/:token", controller.init);

router.post("/submit/:token", controller.submit);
module.exports = router;

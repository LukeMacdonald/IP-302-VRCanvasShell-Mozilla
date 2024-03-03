module.exports = (express, app) => {
  const controller = require("../controllers/canvas-controller");

  const router = express.Router();

  router.get("/course/teacher", controller.teacherCourses);

  router.get("/course/student", controller.studentCourses);

  router.get("/modules/:courseID", controller.modules);

  router.get("/quizzes/:courseID", controller.quizzes);

  router.get("/module/files/:courseID/:moduleID", controller.moduleFiles);

  router.get("/files/:courseID", controller.courseFiles);

  router.get("/profile", controller.profile);

  router.get("/upload/:courseID", controller.uploadFile);

  router.get("/backups/:courseID", controller.backups);

  router.post("/module/add", controller.createModuleItem);

  router.post("/quiz", controller.updateQuiz);

  router.post("/restore", controller.restore);

  app.use("/canvas", router);
};

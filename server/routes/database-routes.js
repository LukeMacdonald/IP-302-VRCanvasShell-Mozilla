module.exports = (express, app) => {

    const controller = require("../controllers/database-controller");

    const router = express.Router();
  
    router.post('/module/create', controller.createModule);

    router.get('/modules/:courseID', controller.modules);

    router.get('/module/:courseID/:moduleID', controller.module);

    router.get('/room/:courseID/:moduleID/:roomID', controller.room);

    router.post('/account/link', controller.linkAccount);

    router.get('/account/auth/:id/:password', controller.authenticate);

    app.use("/data", router)
}
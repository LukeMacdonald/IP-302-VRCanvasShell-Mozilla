module.exports = (express, app) => {
    
    const controller = require("../controllers/hubs-controller");

    const router = express.Router();

    router.post('/room/create', controller.create);

    router.post('/room/edit', controller.edit);

    router.post('/reload-room', controller.reload);   

    app.use("/hubs", router);

}
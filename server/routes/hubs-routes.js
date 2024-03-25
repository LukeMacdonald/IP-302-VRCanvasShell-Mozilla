const express = require("express");
const controller = require("../controllers/hubs-controller");

const router = express.Router();

router.post("/room/create", controller.create);

router.post("/room/edit", controller.edit);

router.post("/reload-room", controller.reload);

router.get("/room/update/:roomID", controller.backup);

module.exports = router;


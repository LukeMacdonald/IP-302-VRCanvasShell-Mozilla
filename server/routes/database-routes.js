const express = require("express");
const controller = require("../controllers/database-controller");

const router = express.Router();

router.post("/module/create", controller.createModule);

router.get("/modules/:courseID", controller.modules);

router.get("/module/:courseID/:moduleID", controller.module);

router.get("/room/:courseID/:moduleID/:roomID", controller.room);

router.post("/account/link", controller.linkAccount);

router.put("/account/key", controller.updateKey);

router.get("/account/auth/:id/:password", controller.authenticate);
router.get("/backup", controller.backup);

router.delete("/module/:moduleID", controller.deleteModule);

router.delete("/room/:roomID", controller.deleteRoom);

module.exports = router;

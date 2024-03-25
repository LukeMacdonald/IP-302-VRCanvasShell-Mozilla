const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth");
const verifyCanvas = require("../middleware/verifyCanvasAccount");
router.post("/login", controller.login);
router.post("/register", verifyCanvas, controller.register);
router.put("/key", verifyCanvas, controller.updateKey);
module.exports = router;

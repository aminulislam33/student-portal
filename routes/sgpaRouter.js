const express = require("express");
const calculateSGPAController = require("../controller/calculateSGPAController");
const router = express.Router();

router.post("/sgpa", calculateSGPAController);

module.exports = router;
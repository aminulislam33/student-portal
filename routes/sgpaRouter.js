const express = require("express");
const calculateGPAController = require("../controller/calculateSGPAController");
const router = express.Router();

router.get("/", calculateGPAController);

module.exports = router;
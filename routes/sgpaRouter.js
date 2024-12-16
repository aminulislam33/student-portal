const express = require("express");
const calculateGPAController = require("../controller/calculateSGPAController");
const router = express.Router();

router.post("/", calculateGPAController);

module.exports = router;
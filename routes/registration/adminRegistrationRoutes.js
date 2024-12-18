const express = require('express');
const { registerAdmin } = require('../../controller/registration/adminRegistrationController');

const router = express.Router();

router.post('/', registerAdmin);

module.exports = router;
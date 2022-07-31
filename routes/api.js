// Database operations
const express = require("express");

const router = express.Router();


// Account API Router
router.use("/account", require("./api/account.js"));


module.exports = router;
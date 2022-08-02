// Database operations
const express = require("express");

const router = express.Router();


// Account API Router
router.use("/account", require("./api/account.js"));

router.use("/storage", require("./api/storage.js"));


module.exports = router;
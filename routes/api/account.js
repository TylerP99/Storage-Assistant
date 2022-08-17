const express = require("express");

const router = express.Router();

const AccountController = require("../../controllers/account.js");

router.post("/create", AccountController.create_account);

router.post("/authenticate", AccountController.authenticate_account)

module.exports = router;
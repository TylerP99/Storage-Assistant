const express = require("express");

const router = express.Router();

const AccountController = require("../../controllers/account.js");

const {ensureAuthenticated} = require("../../config/auth-middleware");

router.post("/create", AccountController.create_account);

router.post("/authenticate", AccountController.authenticate_account)

router.put("/updateEmail", ensureAuthenticated, AccountController.update_account_email);

router.put("/updatePassword", ensureAuthenticated, AccountController.update_account_password);

router.delete("/logout", AccountController.logout_account);

module.exports = router;
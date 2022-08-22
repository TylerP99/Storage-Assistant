const express = require("express");
const router = express.Router();

const IndexViewController = require("../controllers/index");
const {ensureAuthenticated, forwardIfAuthenticated} = require("../config/auth-middleware")

router.get("/", IndexViewController.get_landing);

router.get("/login", forwardIfAuthenticated, IndexViewController.get_login);

router.get("/register", forwardIfAuthenticated, IndexViewController.get_register);

router.get("/logout", IndexViewController.get_logout);

router.get("/settings", ensureAuthenticated, IndexViewController.get_settings);

router.get("/changelog", ensureAuthenticated, IndexViewController.get_changelog);

router.get("/unauthorized", IndexViewController.get_403);

router.get("/notfound", IndexViewController.get_404);

module.exports = router;
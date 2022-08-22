const express = require("express");
const router = express.Router();

const IndexViewController = require("../controllers/index");

router.get("/", IndexViewController.get_landing);

router.get("/login", IndexViewController.get_login);

router.get("/register", IndexViewController.get_register);

router.get("/logout", IndexViewController.get_logout);

router.get("/settings", IndexViewController.get_settings);

router.get("/unauthorized", IndexViewController.get_403);

router.get("/notfound", IndexViewController.get_404);

module.exports = router;
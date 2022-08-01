const express = require("express");

const router = express.Router();

const { ensureAuthenticated, forwardIfAuthenticated } = require("../config/auth-middleware.js");



// Root/Landing Route
router.get("/", (req, res) => {
    console.log("GET landing");
    res.render("landing.ejs");
});

// Registration route
router.get("/register", forwardIfAuthenticated, (req, res) => {
    console.log("GET register");
    res.render("register.ejs");
});

// Login route
router.get("/login", forwardIfAuthenticated, (req,res) => {
    console.log("GET login");
    res.render("login.ejs");
});

// Storage Route
router.get("/storage", ensureAuthenticated, (req, res) => {
    res.render("storage.ejs");
});


module.exports = router;
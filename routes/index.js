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

    // Get all the data :o
    let locations = undefined;
    let containers = undefined;
    let items = undefined;

    res.render("storage.ejs", {locations, containers, items});
});


module.exports = router;
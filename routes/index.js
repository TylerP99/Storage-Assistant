const express = require("express");

const router = express.Router();



// Root/Landing Route
router.get("/", /*forwardAuthenticate,*/ (req, res) => {
    console.log("GET landing");
    res.render("landing.ejs");
});

// Registration route
router.get("/register", /*forwardAuthenticate,*/ (req, res) => {
    console.log("GET register");
    res.render("register.ejs");
});

// Login route
router.get("/login", /*forwardAuthenticate,*/ (req,res) => {
    console.log("GET login");
    res.render("login.ejs");
});

// Storage Route
router.get("/storage", (req, res) => {
    res.render("storage.ejs");
});


module.exports = router;
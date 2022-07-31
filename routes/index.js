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


module.exports = router;
const express = require("express");

const router = express.Router();

const { ensureAuthenticated, forwardIfAuthenticated } = require("../config/auth-middleware.js");

const User = require("../models/User.js");
const StorageLocation = require("../models/StorageLocation.js");
const Container = require("../models/Container.js");
const Item = require("../models/Item");

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
router.get("/dashboard", ensureAuthenticated, async (req, res) => {

    // Get all the data :o
    let locations = await StorageLocation.find();
    let containers = await Container.find();
    let items = await Item.find();

    console.log(locations);

    res.render("dashboard.ejs", {locations:locations, containers:containers, items:items});
});

router.get("/location/:id", ensureAuthenticated, async (req, res) => {
    // Get location from db to pass to ejs
    const location = await StorageLocation.findById(req.params.id);

    res.render("storage-location-page.ejs", {location:location});
})


module.exports = router;
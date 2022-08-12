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

// Logout route
router.delete("/logout", ensureAuthenticated, async (req,res) => {
    req.logout((e) => {
        if(e) {
            console.error(e);
            return res.json({valid:false});
        }
        res.json({valid:true});
    });
});

// Logout page route
router.get("/logout", (req,res) => {
    res.render("logged-out.ejs");
});

// Account Route
router.get("/settings", ensureAuthenticated, (req,res) => {
    res.render("settings.ejs");
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

// Storage Location View
router.get("/location/:id", ensureAuthenticated, async (req, res) => {
    try{
        // Get location from db to pass to ejs
        const location = await StorageLocation.findById(req.params.id);

        // Next, need to get the containers and items
        let containers = location.contents.filter( x => x.type == "container");
        containers = containers.map( x => x.id);

        console.log(containers);

        containers = await Container.find({
            "_id": {$in:containers}
        })

        console.log(containers);

        let items = location.contents.filter( x => x.type == "item");
        items = items.map ( x => x.id);
        items = await Item.find({
            "_id": {$in:items}
        })

        res.render("storage-location-view.ejs", {location:location, containers:containers, items:items});
    }
    catch(e) {
        console.error(e);
        res.render("404.ejs");
    }
});

// Container View
router.get("/container/:id", ensureAuthenticated, async (req, res) => {
    try{
        // Get container from the db
        const container = await Container.findById(req.params.id);

        // Filter contents into containers and items
        let items = container.contents.filter( x => x.type == "item").map( x => x.id );
        let containers = container.contents.filter(x => x.type == "container").map( x => x.id );

        // Get contents from db
        items = await Item.find({"_id": {$in:items}});
        containers = await Container.find({"_id": {$in:containers}});

        // Get all elligable destinations for a move operation
        const destinations = await get_destinations(req.user.id);

        res.render("container-view.ejs", {container:container, items:items, containers:containers});
    }
    catch(e) {
        console.error(e);
        res.render("404.ejs");
    }
});

// Item View
router.get("/item/:id", ensureAuthenticated, async (req, res) => {
    try{
        // Get the item from the database
        const item = await Item.findById(req.params.id);

        // Render the page, sending the item
        res.render("item-view.ejs", {item:item});
    }
    catch(e) {
        console.error(e);
        res.render("404.ejs");
    }
});

async function get_destinations(user) {
    // Get all locations and containers from db, convert to id, type pairs, return combined array
}


module.exports = router;
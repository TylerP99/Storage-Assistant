// Storage Database operations
const express = require("express");

const router = express.Router();

const { ensureAuthenticated, forwardIfAuthenticated } = require("../../config/auth-middleware.js");

const User = require("../../models/User.js");
const StorageLocation = require("../../models/StorageLocation.js");
const Container = require("../../models/Container.js");
const Item = require("../../models/Item");




// Storage Location Operations

// Create new StorageLocation
router.post("/create/StorageLocation", ensureAuthenticated, async (req, res, next) => {
    // Will receive object from req, construct object
    const newLocation = {
        name: req.body.location.name,
        description: req.body.location.description,
        // Contents are modified by app
        length: req.body.location.length,
        width: req.body.location.width,
        height: req.body.location.height,
        // Date set by mongoose
        owner: req.user.id
    };

    // Then validate object
    const validation = is_valid_storage_location(newLocation);

    if(!validation.valid) {
        // Invalid object, send response with error info
        return res.status(400).json(validation);
    }

    // Need to add new location document to db
    try{
        await StorageLocation.create(newLocation);
        return res.status(201).json(validation);
    }
    catch(e){
        console.error(e);
        next(e);
    } 
});

function is_valid_storage_location(location) {
    // Will validate the location, and give good error info

    // For now, just return true
    return true;
}

// Edit StorageLocation properties

// Add object to StorageLocation (put) (object is either item or container)

// Delete StorageLocation (and all contents!!)


// Container Operations

// Create new Container in db (pushing onto Location handled by Location)

// Edit Container properties

// Add object to Container (object is either item or container [smaller containers can be put into larger ones])

// Delete container from db


// Item Operations

// Create new Item in db

// Edit item properties

// Delete item from db


module.exports = router;
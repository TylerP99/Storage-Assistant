// Storage Database operations
const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const { ensureAuthenticated, forwardIfAuthenticated } = require("../../config/auth-middleware.js");

const User = require("../../models/User.js");
const StorageLocation = require("../../models/StorageLocation.js");
const Container = require("../../models/Container.js");
const Item = require("../../models/Item");




// Storage Location Operations

// Create new StorageLocation
router.post("/create/StorageLocation", ensureAuthenticated, async (req, res, next) => {
    console.log(req.body);
    // Will receive object from req, construct object
    const newLocation = req.body.location;
    newLocation.owner = req.user.id;

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
    const validation = {
        valid: true,
        errors: ""
    }

    // For now, just return true
    return validation;
}

// Edit StorageLocation properties
router.put("/update/StorageLocation", async (req, res, next) => {
    console.log(req.body);
    // Construct object from req
    const updatedLocation = req.body.location;

    console.log(updatedLocation);

    // Verify object again baby
    const validation = is_valid_storage_location(updatedLocation);

    if(!validation.valid) {
        return res.status(400).json(validation);
    }

    // Update object by id
    try {
        console.log("Mongoose access");
        await StorageLocation.findByIdAndUpdate(
            req.body.id, // Id to find
            updatedLocation, // Properties to update
            { // Options
                upsert: false // Dont make a new one if the one to update isnt found..
            }
        )

        return res.status(200).json(validation);
    }
    catch(e) {
        console.error(e);
        next(e);
    }
});

// Add object to StorageLocation (put) (object is either item or container)
router.put("/add/StorageLocation", async (req,res,next) => {
    // Add user id to obj to be created
    req.body.obj.owner = req.user.id;
    req.body.obj.parent = {
        id: new mongoose.mongo.ObjectId(req.body.id),
        type: "location"
    };
    // Determine resource to be created
    let newObj = {
        obj: {},
        validation: {
            valid: false,
            errors: "Request type not recognized."
        }
    }

    if(req.body.type == "container") {
        newObj = await create_new_container(req.body.obj);
    }
    else if (req.body.type == "item") {
        newObj = await create_new_item(req.body.obj);
    }

    console.log(newObj);

    if(!newObj.validation.valid) {
        // Req invalid
        return res.status(400).json(newObj.validation);
    }

    // Add new item now
    try {
        await StorageLocation.findByIdAndUpdate(
            req.body.id,
            { $push: {contents: newObj.obj}},
            {
                upsert:false
            }
        )
        console.log("Successfully added");
        return res.status(200).json(newObj.validation);
    }
    catch(e) {
        console.error(e);
        next(e);
    }
});

// Delete StorageLocation (and all contents!!)
router.delete("/delete/StorageLocation", async (req, res, next) => {
    const id = req.body.id;

    try {
        // Get the thing from the database first
        const location = await StorageLocation.findById(id);

        // Go through the contents and delete each item
        location.contents.forEach(async x => {
            if(x.type == "container") {
                const validation = delete_container(x.id);
            }
            else
            {
                await Item.findByIdAndDelete(x.id);
            }
        });

        // Next delete the location
        await StorageLocation.findByIdAndDelete(location.id);

        // Done, send success
        res.status(200).json({valid: true, errors: ""});
    }
    catch(e) {
        console.error(e);
        next(e);
    }
});


// Container Operations

// Create new Container in db (pushing onto Location handled by Location)
async function create_new_container(container) {
    const validation = is_valid_container(container);
    const newObj = {
        obj: {},
        validation: validation
    }

    if(!validation.valid) {
        return newObj;
    }

    console.log("New Container:")
    console.log(container)

    try{
        const newContainer = await Container.create(container);
        newObj.obj = { 
            id:newContainer._id,
            type: "container" 
        }
        return newObj;
    }
    catch(e) {
        console.error(e);
        newObj.validation.errors = e;
        return newObj;
    }
}

function is_valid_container(container) {
    const validation = {
        valid: true,
        errors: ""
    }

    return validation;
}

// Edit Container properties
router.put("/update/Container", async (req,res,next) => {
    const validation = is_valid_container(req.body.container);

    if(!validation.valid) {
        return res.status(400).json(validation);
    }

    try{
        await Container.findByIdAndUpdate(
            req.body.id,
            req.body.container,
            {
                upsert: false
            }
        );
        res.status(200).json(validation);
    }
    catch(e) {
        console.error(e);
        next(e);
    }
});

router.put("/move/Container", async (req,res,next) => {
    try{
        // Get target from db, so we can access parent id
        const container = await Container.findById(req.body.id);

        // Remove target from origins content array
        if(container.parent.type == "location") {
            console.log("RETURN")
            console.log(await StorageLocation.findByIdAndUpdate(
                container.parent.id,
                {
                    $pull: {
                        contents: {id: new mongoose.mongo.ObjectId(container.id)}
                    }
                },
                {
                    upsert: false
                }
            ));
        }
        else if(container.parent.type == "container") {
            console.log(await Container.findByIdAndUpdate(
                container.parent.id,
                {
                    $pull: {
                        contents: {id: new mongoose.mongo.ObjectId(container.id)}
                    }
                },
                {
                    upsert: false
                }
            ));
        }

        // Now, add the container to the new parent
        if(req.body.destination.type == "location") {
            await StorageLocation.findByIdAndUpdate(
                req.body.destination.id,
                {
                    $push: {
                        contents: {
                            id: new mongoose.mongo.ObjectId(container.id),
                            type: "container"
                        }
                    }
                },
                {
                    upsert: false
                }
            );
        }
        else if(req.body.destination.type == "container") {
            await Container.findByIdAndUpdate(
                req.body.destination.id,
                {
                    $push: {
                        contents: {
                            id: new mongoose.mongo.ObjectId(container.id),
                            type: "container"
                        }
                    }
                },
                {
                    upsert: false
                }
            );
        }

        // Finally, update target parent
        await Container.findByIdAndUpdate(
            container.id,
            {
                $set: {
                    parent: {
                        id: new mongoose.mongo.ObjectId(req.body.destination.id),
                        type: req.body.destination.type
                    }
                },
            },
            {
                upsert: false
            }
        );

        res.status(200).json({valid:true});
    }
    catch(e) {
        console.error(e);
        next(e);
    }
})

// Add object to Container (object is either item or container [smaller containers can be put into larger ones])
router.put("/add/Container", async (req,res,next) => {
    // Determine type
    const obj = req.body.obj;
    obj.owner = req.user.id;
    obj.parent = {
        id: new mongoose.mongo.ObjectId(req.body.id),
        type: "container"
    };

    console.log(obj);

    let newObj = {
        obj: {},
        validation: {
            valid: false,
            errors: ""
        }
    };

    if(req.body.type == "container") {
        newObj = await create_new_container(obj);
    }
    else if(req.body.type == "item") {
        newObj = await create_new_item(obj);
    }

    console.log(newObj);

    if(!newObj.validation.valid) {
        return res.status(400).json(newObj.validation);
    }

    try{
        await Container.findByIdAndUpdate(
            req.body.id,
            {
                $push: {contents: newObj.obj}
            },
            {
                upsert: false
            }
        )
        return res.status(200).json(newObj.validation);
    }
    catch(e) {
        console.error(e);
        next(e);
    }
});

// Delete container request
router.delete("/delete/Container", async (req, res, next) => {
    const id = req.body.id;

    const validation = await delete_container(id);

    if(!validation.valid) {
        return res.status(400).json(validation);
    }

    res.status(200).json(validation);
});

// Delete container from db
async function delete_container(id) {
    try{
        const container = await Container.findById(id);

        // Delete each item in the container
        container.contents.forEach(async x => {
            if(x.type == "container") {
                delete_container(x.id);
            }
            else
            {
                await Item.findByIdAndDelete(x.id);
            }
        });

        // Now delete the container itself
        await Container.findByIdAndDelete(id);
        return {valid: true, error:""};
    }
    catch(e) {
        console.error(e);
        return {valid: false, error:e};
    }
}


// Item Operations

// Edit item properties
router.put("/update/Item", async (req, res, next) => {
    const updatedItem = req.body.item

    const validation = is_valid_item(updatedItem);

    if(!validation.valid) {
        // Bad request
        return res.status(400).json(validation);
    }
    try {
        // Valid, update item
        await Item.findByIdAndUpdate(
            req.body.id,
            updatedItem,
            {
                upsert: false // Dont want a new item
            }
        );

        res.json(validation);
    }
    catch(e) {
        console.error(e);
        next(e);
    }
});

// Move item
router.put("/move/Item", async (req, res, next) => {
    try{
        // Get things to be edited
        // Item to move
        const item = await Item.findById(req.body.id);

        console.log("Found item")
        console.log(item.id);
        

        // Remove item from contents of origin
        if(item.parent.type == "location") {
            const loc = await StorageLocation.findByIdAndUpdate(
                item.parent.id,
                {
                    $pull: {
                        contents: { id: new mongoose.mongo.ObjectId(item.id)}
                    }
                },
                {
                    safe: true,
                    upsert: false,
                }
            );
            console.log(loc);

            console.log("Item deleted from location");
        }
        else if(item.parent.type == "container") {
            await Container.findByIdAndUpdate(
                item.parent.id,
                {
                    $pull: {
                        contents: { id: new mongoose.mongo.ObjectId(item.id) }
                    }
                },
                {
                    safe: true,
                    upsert: false,
                }
            );
            console.log("Item deleted from container");
        }

        // Add item to contents of destination
        if(req.body.destination.type == "location") {
            await StorageLocation.findByIdAndUpdate(
                req.body.destination.id,
                {
                    $push: {
                        contents: {
                            id: new mongoose.mongo.ObjectId(item.id), 
                            type: "item"
                        }
                    }
                },
                {
                    upsert: false,
                }
            );
            console.log("Item added to location");
        }
        else if(req.body.destination.type == "container") {
            await Container.findByIdAndUpdate(
                req.body.destination.id,
                {
                    $push: {
                        contents: {
                            id: new mongoose.mongo.ObjectId(item.id), 
                            type: "item"
                        }
                    }
                },
                {
                    upsert: false,
                }
            );
            console.log("Item added to container");
        }

        // Change item parent
        await Item.findByIdAndUpdate(
            req.body.id,
            {
                $set: {
                    parent: {
                        id: new mongoose.mongo.ObjectId(req.body.destination.id),
                        type: req.body.destination.type
                    }
                }
            },
            {
                upsert: false,
            }
        );
        console.log("Item parent changed");

        // Respond
        res.status(200).json({valid: true});
    }
    catch(e) {
        console.error(e);
        next(e);
    }
});

// Delete item from db
router.delete("/delete/Item", async (req,res,next) => {
    try{
        await Item.findByIdAndDelete(req.body.id);
        res.status(200).json({valid: true})
    }
    catch(e) {
        console.error(e);
        next(e);
    }
});

// Item Helpers

// Create new Item in db to be pushed by storageLocation or container add routes
async function create_new_item(item) {
    // Validate item first
    const newObj = {
        obj: {},
        validation: is_valid_item(item)
    };

    if(!newObj.validation.valid) {
        return newObj;
    }

    try{
        const newItem = await Item.create(item);
        console.log(newItem);
        newObj.obj = {
            id: newItem._id,
            type:"item"
        };
        return newObj;
    }
    catch(e) {
        console.error(e);
        return newObj;
    }
}

// Item validation
function is_valid_item(item) {
    //Check all properties
    const validation = {
        valid: true,
        errors: ""
    }

    //For now, return true
    return validation;
}


module.exports = router;
// Storage controller
const mongoose = require("mongoose");
const Location = require("../models/Location.js");
const Container = require("../models/Container.js");
const Item = require("../models/Item.js");

const StorageController = {

    /*
        All routes respond with: 
            validation: {
                valid
                errors: [];
            }
    */

    //========================//
    //  Location Controllers  //
    //========================//

    // Routed methods

    /*
        Creates a new location

        Receives request with:
        body: {
            location (new location to be made)
        }
    */
    create_location: async (req, res, next) => {
        // Get object from request, set owner
        const newLocation = req.body.location;
        newLocation.owner = req.user.id;

        // Validate object later
        // Validation tells user what they entered wrong

        // Try catch for async/await error handling
        try {
            // Create new location in db
            await Location.create(newLocation);

            // Send successful response
            res.status(201).json({valid:true});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    /*

        Request body:
        body: {
            location (location properties to be updated)
            id (id of location to edit)
        }

    */
    update_location: async (req, res, next) => {
        // Get location and id from req
        const updatedLocation = req.body.location;
        const locationID = req.body.id;

        // Eventually will validate

        try {
            await Location.findByIdAndUpdate(
                locationID, // ID to search for
                updatedLocation, // Properties to update
                { // Options
                    upsert: false // Do not make new location if the targeted location was not found
                }
            );

            res.status(200).json({valid:true});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    /*
        Request body:
        body: {
            obj (obj to add to location)
            type (type of obj to add, either container or item)
            id (id of location to add to)
        }
    */
    add_to_location: async (req, res, next) => {
        console.log(this);
        // Get info from request body
        const newObj = req.body.obj;
        const locationID = req.body.id;
        const objType = req.body.type;

        newObj.owner = req.user.id;
        newObj.parent = {
            id: new mongoose.mongo.ObjectId(locationID),
            type: "location"
        };

        let objAndInfo = {
            // Object to be created
            newObj: {
                id: "",
                type: ""
            },
            // Validation of object
            validation: {
                valid: true,
                errors: []
            }
        };

        if( objType == "container" ) {
            // Function creates container, adds to db, and returns content object to add to location
            objAndInfo = await StorageController.create_container(newObj);
        }

        if( objType == "item") {
            // Function creates item, adds to db, and returns content object to add to location
            objAndInfo = await StorageController.create_item(newObj);
        }

        // Add new object to location contents array
        try{
            await Location.findByIdAndUpdate(
                locationID,
                { $push: {contents: objAndInfo.newObj} },
                { upsert: false}
            );

            res.status(200).json({valid:true});
        }
        catch(e) {
            console.error(e);
            next(e);
        }

    },

    /*
        Request Body:
        body{
            id (id of location to be deleted)
        }
    */
    delete_location: async (req, res, next) => {
        // Get id from req body
        const locationID = req.body.id;

        try {
            // Get location from db
            const location = await Location.findById(locationID);

            // Delete everything in the contents array
            location.contents.forEach( async x => {
                // Determine type of x for correct delete method
                if(x.type == "container") {
                    return await StorageController.delete_container_helper(x.id);
                }

                if(x.type == "item") {
                    return await Item.findByIdAndDelete(x.id);
                }

                throw("Invalid item type");
            });

            // Delete the location
            await Location.findByIdAndDelete(locationID);

            // Respond with success
            res.status(200).json({valid:true});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    // Location Helpers
    validate_location: (location) => {
        // Validation functions return a validation object
        const validation = {
            valid: true,
            errors: [] // Two options for errors: a flag object or an array of error messages
        };


    },

    //========================//
    //  Container Controllers //
    //========================//

    // Routed methods

    /*
        Request body:
        body: {
            container: container information to change
            id: id of container to change
        }
    */
    update_container: async (req, res, next) => {
        // Get updated container info and id from request
        const updatedContainer = req.body.container;
        const containerID = req.body.id;

        // Validate it

        try{
            // Update container in db
            await Container.findByIdAndUpdate(
                containerID,
                updatedContainer,
                { upsert: false }
            );

            // Send success response
            res.status(200).json({valid:true});

        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    /*
        Request body:
        body: {
            id: id of container to add to
            obj: thing to add to container
            type: type of thing to add to container (item or container)
        }
    */
    add_to_container: async (req, res, next) => {
        // Get info from request body, finish newObj
        const containerID = req.body.id;
        const newObj = req.body.obj;
        newObj.owner = req.user.id;
        newObj.parent = {
            id: new mongoose.mongo.ObjectId(containerID),
            type: "container"
        };
        const newObjType = req.body.type;

        let objAndInfo = {
            newObj: {
                id: "",
                type: newObj.type
            },
            validation: {
                valid: true,
                errors: []
            }
        }

        try {
            // Create new obj in db, get content info object returned
            if(newObjType == "container") {
                objAndInfo = await StorageController.create_container(newObj);
            }
            else if( newObjType == "item") {
                objAndInfo = await StorageController.create_item(newObj);
            }

            // Add content info object to container contents array
            await Container.findByIdAndUpdate(
                containerID,
                { $push: { contents: objAndInfo.newObj } },
                { upsert: false }
            )

            // Respond with success
            res.status(200).json({valid:true});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    /*
        Request body:
        body: {
            id: id of container to move
            destination: {
                id: id of destination
                type: type of destination (location or container)
            }
        }
    */
    move_container: async (req, res, next) => {
        // Get information from request
        const containerID = req.body.id;
        const destination = req.body.destination;

        try{
            // Get container to move from db, need parent info
            const container = await Container.findById(containerID);

            // Delete container from parent contents
            // First determine parent type, then delete using the right model
            if(container.parent.type == "location") {
                // Delete from location
                await Location.findByIdAndUpdate(
                    container.parent.id,
                    {
                        $pull: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(container.id)
                            }
                        }
                    },
                    { upsert: false }
                );
            }
            else if( container.parent.type == "container") {
                // Delete from container
                await Container.findByIdAndUpdate(
                    container.parent.id,
                    {
                        $pull: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(container.id)
                            }
                        }
                    },
                    { upsert: false }
                );
            }

            // Add container type and id object to destination contents array
            if( destination.type == "location") {
                await Location.findByIdAndUpdate(
                    destination.id,
                    {
                        $push: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(container.id),
                                type: "container"
                            }
                        }
                    },
                    { upsert: false }
                )
            }
            else if( destination.type == "container") {
                await Container.findByIdAndUpdate(
                    destination.id,
                    {
                        $push: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(container.id),
                                type: "container"
                            }
                        }
                    },
                    { upsert: false }
                )
            }
            else {
                // Invalid destination type
            }


            // Change container parent object to new parent info
            await Container.findByIdAndUpdate(
                container.id,
                {
                    $set: {
                        parent: {
                            id: new mongoose.mongo.ObjectId(destination.id),
                            type: destination.type
                        }
                    }
                },
                { upsert: false }
            )

            // Send successful response
            res.status(200).json({valid:true});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    /*
        Request body:
        body: {
            id: id of container to delete
        }
    */
    delete_container: async (req, res, next) => {
        // Get info from req body
        const containerID = req.body.id;

        // Call the helper function
        try{
            const container = await Container.findById(containerID);

            if(container.parent.type == "location") {
                await Location.findByIdAndUpdate(
                    container.parent.id,
                    {
                        $pull: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(container.id)
                            }
                        }
                    }
                );
            }
            else if (container.parent.type == "container") {
                await Container.findByIdAndUpdate(
                    container.parent.id,
                    {
                        $pull: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(container.id)
                            }
                        }
                    }
                );
            }
            else {
                // Invalid type
            }

            await StorageController.delete_container_helper(containerID);

            res.status(200).json({valid:true});
        }
        catch(e) {
            console.log(e);
            next(e);
        }
    },

    // Helper methods

    create_container: async (newContainer) => {
        // Create object info object
        const objAndInfo = {
            newObj: {
                id: "", // Get later
                type: "container"
            },
            validation: {
                valid: true,
                errors: []
            }
        }

        // Validate container later


        // Make container in db
        const container = await Container.create(newContainer);

        // Add id to return obj
        objAndInfo.newObj.id = new mongoose.mongo.ObjectId(container.id);

        // Return obj
        return objAndInfo;
    },

    delete_container_helper: async (containerID) => {
        // Get container from db
        const container = await Container.findById(containerID);

        if(!container) return;

        // Go through contents array and delete each item
        container.contents.forEach( async x => {
            if(x.type == "item") {
                await Item.findByIdAndDelete(x.id);
            }
            else if(x.type == "container") {
                await StorageController.delete_container_helper(x.id);
            }
        });

        // Delete container now
        await Container.findByIdAndDelete(containerID);

        // Possibly return success
    },

    //========================//
    //    Item Controllers    //
    //========================//

    // Routed methods

    /*
        body: {
            item: updated item
            id: id of item to update
        }
    */
    update_item: async (req, res, next) => {
        // Get info from request body
        const updatedItem = req.body.item;
        const itemID = req.body.id;

        // Validate item later

        //Update item
        try{
            await Item.findByIdAndUpdate(
                itemID,
                updatedItem,
                { upsert: false }
            )

            // Successful response
            res.status(200).json({valid:true});
        }
        catch(e) {
            console.log(e);
            next(e);
        }
    },

    /*
        body: {
            id: id of item to move
            destination: {
                id: id of destination
                type: type of destination (container or location)
            }
        }
    */
    move_item: async (req, res, next) => {
        // Get info from req body
        const itemID = req.body.id;
        const destination = req.body.destination;

        try{
            // Get item from db to access parent
            const item = await Item.findById(itemID);

            // Remove item object from contents of parent
            if(item.parent.type == "location") {
                await Location.findByIdAndUpdate(
                    item.parent.id,
                    {
                        $pull: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(item.id)
                            }
                        }
                    },
                    { upsert: false }
                );
            }
            else if( item.parent.type == "container") {
                await Container.findByIdAndUpdate(
                    item.parent.id,
                    {
                        $pull: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(item.id)
                            }
                        }
                    },
                    { upsert: false }
                );
            }
            else {
                // Invalid parent type
            }

            // Add new content object to destination
            if(destination.type == "location") {
                await Location.findByIdAndUpdate(
                    destination.id,
                    {
                        $push: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(item.id),
                                type: "item"
                            }
                        }
                    },
                    { upsert: false }
                );
            }
            else if( destination.type == "container") {
                await Container.findByIdAndUpdate(
                    destination.id,
                    {
                        $push: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(item.id),
                                type: "item"
                            }
                        }
                    },
                    { upsert: false }
                );
            }
            else
            {
                // Invalid destination type
            }

            // Update item parent
            await Item.findByIdAndUpdate(
                itemID,
                {
                    $set: {
                        parent: {
                            id: new mongoose.mongo.ObjectId(destination.id),
                            type: destination.type
                        }
                    }
                }
            )

            res.status(200).json({valid:true});
        }
        catch(e) {
            console.error(e);
            next(e);
        }

    },

    /*
        body: {
            id: id of item to delete
        }
    */
    delete_item: async (req, res, next) => {
        // Get info from req body
        const itemID = req.body.id;

        // Delete item and respond
        try {
            const item = await Item.findById(itemID);

            if(item.parent.type == "location") {
                await Location.findByIdAndUpdate(
                    item.parent.id,
                    {
                        $pull: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(item.id)
                            }
                        }
                    }
                );
            }
            else if (item.parent.type == "container") {
                await Container.findByIdAndUpdate(
                    item.parent.id,
                    {
                        $pull: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(item.id)
                            }
                        }
                    }
                );
            }

            await Item.findByIdAndDelete(itemID);

            res.status(200).json({valid:true});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    // Helper methods

    create_item: async (newItem) => {
        // Construct return object
        const objAndInfo = {
            newObj: {
                id: "",
                type: "item"
            },
            validation: {
                valid:true,
                errors: []
            }
        }

        // Create item in db
        const item = await Item.create(newItem);

        // Add id to return
        objAndInfo.newObj.id = new mongoose.mongo.ObjectId(item.id);

        return objAndInfo;
    }

}

module.exports = StorageController;
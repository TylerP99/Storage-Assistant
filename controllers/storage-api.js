// Storage controller
const mongoose = require("mongoose");
const Location = require("../models/Location.js");
const Container = require("../models/Container.js");
const Item = require("../models/Item.js");

const ChangelogController = require("./changelog");

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
        const validation = StorageController.validate_storage_object(newLocation);

        if(!validation.valid) {
            return res.status(400).json(validation);
        }

        // Try catch for async/await error handling
        try {
            // Create new location in db
            const createdLocation = await Location.create(newLocation);

            await ChangelogController.log_creation(createdLocation, req.user.id);

            // Send successful response
            res.status(201).json(validation);
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
        const validation = StorageController.validate_storage_object(updatedLocation);

        if(!validation.valid) {
            return res.status(400).json(validation);
        }

        try {
            const oldLocation = await Location.findByIdAndUpdate(
                locationID, // ID to search for
                updatedLocation, // Properties to update
                { // Options
                    upsert: false // Do not make new location if the targeted location was not found
                }
            );

            const newLocation = await Location.findById(locationID);

            await ChangelogController.log_update(newLocation, oldLocation, req.user.id);

            res.status(200).json(validation);
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
        newObj.type = objType;

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

        if(!objAndInfo.validation.valid) {
            return res.status(400).json(objAndInfo.validation);
        }

        // Add new object to location contents array
        try{
            const location = await Location.findByIdAndUpdate(
                locationID,
                { $push: {contents: objAndInfo.newObj} },
                { 
                    upsert: false,
                    new: true
                }
            );

            console.log("newObj");
            console.log(newObj);

            await ChangelogController.log_addition(newObj, location, req.user.id)

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

            await ChangelogController.log_deletion(location, req.user.id);

            // Respond with success
            res.status(200).json({valid:true});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    // Location Helpers
    validate_storage_object: (storageObj) => {
        // Validation functions return a validation object
        const validation = {
            valid: true,
            errors: {
                nameErrors: {
                    undefined: false,
                    tooLarge: false
                },
                descriptionErrors: {
                    tooLarge: false
                },
                lengthErrors: {
                    tooLarge: false
                },
                widthErrors: {
                    tooLarge: false
                },
                heightErrors: {
                    tooLarge: false
                },
                quantityErrors: {
                    tooLarge: false,
                    notPositive: false
                },
                valueErrors: {
                    tooLarge: false
                }
            }
        };

        // Name checks
        if(storageObj.name == undefined) {
            validation.errors.nameErrors.undefined = true;
            validation.valid = false;
        }
        else if(storageObj.name.length > 50) {
            validation.errors.nameErrors.tooLarge = true;
            validation.valid = false;
        }

        // Description check
        if(storageObj.description != undefined && storageObj.description.length > 250) {
            validation.errors.descriptionErrors.tooLarge = true;
            validation.valid = false;
        }

        // Length check
        if(storageObj.length != undefined && storageObj.length.length > 50) {
            validation.errors.lengthErrors.tooLarge = true;
            validation.valid = false
        }

        // Width check
        if(storageObj.width != undefined && storageObj.width.length > 50) {
            validation.errors.widthErrors.tooLarge = true;
            validation.valid = false;
        }

        // Height check
        if(storageObj.height != undefined && storageObj.height.length > 50) {
            validation.errors.heightErrors.tooLarge = true;
            validation.valid = false;
        }

        // Item quantity check
        if(storageObj.quantity != undefined && storageObj.quantity < 1) {
            validation.errors.quantityErrors.notPositive = true;
            validation.valid = false;
        }

        if(storageObj.quantity != undefined && storageObj.quantity.toString().length > 50) {
            validation.errors.quantityErrors.tooLarge = true;
            validation.valid = false;
        }

        // Item estimatedValue check
        if(storageObj.estimatedValue != undefined && storageObj.estimatedValue.length > 50) {
            validation.errors.valueErrors.tooLarge = true;
            validation.valid = false;
        }

        return validation;
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
        const validation = StorageController.validate_storage_object(updatedContainer);

        if(!validation.valid) {
            return res.status(400).json(validation);
        }

        try{
            // Update container in db
            const oldContainer = await Container.findByIdAndUpdate(
                containerID,
                updatedContainer,
                { upsert: false }
            );

            const newContainer = await Container.findById(containerID);

            await ChangelogController.log_update(newContainer, oldContainer, req.user.id);

            // Send success response
            res.status(200).json(validation);

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
        newObj.type = newObjType;

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

            if(!objAndInfo.validation.valid) {
                return res.status(400).json(objAndInfo.validation);
            }

            // Add content info object to container contents array
            const container = await Container.findByIdAndUpdate(
                containerID,
                { $push: { contents: objAndInfo.newObj } },
                { 
                    upsert: false,
                    new: true
                }
            );

            await ChangelogController.log_addition(newObj, container, req.user.id);

            // Respond with success
            res.status(200).json(objAndInfo.validation);
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
        let originObj;
        let destinationObj

        try{
            // Get container to move from db, need parent info
            const container = await Container.findById(containerID);

            // Delete container from parent contents
            // First determine parent type, then delete using the right model
            if(container.parent.type == "location") {
                // Delete from location
                originObj = await Location.findByIdAndUpdate(
                    container.parent.id,
                    {
                        $pull: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(container.id)
                            }
                        }
                    },
                    { 
                        upsert: false,
                        new: true
                    }
                );
            }
            else if( container.parent.type == "container") {
                // Delete from container
                originObj = await Container.findByIdAndUpdate(
                    container.parent.id,
                    {
                        $pull: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(container.id)
                            }
                        }
                    },
                    { 
                        upsert: false,
                        new: true
                    }
                );
            }

            // Add container type and id object to destination contents array
            if( destination.type == "location") {
                destinationObj = await Location.findByIdAndUpdate(
                    destination.id,
                    {
                        $push: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(container.id),
                                type: "container"
                            }
                        }
                    },
                    { 
                        upsert: false,
                        new: true
                    }
                )
            }
            else if( destination.type == "container") {
                destinationObj = await Container.findByIdAndUpdate(
                    destination.id,
                    {
                        $push: {
                            contents: {
                                id: new mongoose.mongo.ObjectId(container.id),
                                type: "container"
                            }
                        }
                    },
                    { 
                        upsert: false, 
                        new:true
                    }
                )
            }
            else {
                // Invalid destination type
            }


            // Change container parent object to new parent info
            const target = await Container.findByIdAndUpdate(
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
            );

            await ChangelogController.log_move(target, originObj, destinationObj, req.user.id);

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
        objAndInfo.validation = StorageController.validate_storage_object(newContainer);

        if(!objAndInfo.validation.valid) {
            return objAndInfo;
        }

        // Make container in db
        const container = await Container.create(newContainer);

        await ChangelogController.log_creation(container, container.owner);

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
                const item = await Item.findByIdAndDelete(x.id);
                await ChangelogController.log_deletion(item, item.owner);
            }
            else if(x.type == "container") {
                await StorageController.delete_container_helper(x.id);
            }
        });

        // Delete container now
        const deletedContainer = await Container.findByIdAndDelete(containerID);

        // Log deletion
        await ChangelogController.log_deletion(deletedContainer, deletedContainer.owner);
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
        const validation = StorageController.validate_storage_object(updatedItem);

        //Update item
        try{
            const oldItem = await Item.findByIdAndUpdate(
                itemID,
                updatedItem,
                { upsert: false }
            );

            const newItem = await Item.findById(itemID);

            await ChangelogController.log_update(newItem, oldItem, req.user.id);

            // Successful response
            res.status(200).json(validation);
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
        let destinationObj;
        let originObj;

        try{
            // Get item from db to access parent
            const item = await Item.findById(itemID);

            // Remove item object from contents of parent
            if(item.parent.type == "location") {
                originObj = await Location.findByIdAndUpdate(
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
                originObj = await Container.findByIdAndUpdate(
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
                destinationObj = await Location.findByIdAndUpdate(
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
                destinationObj = await Container.findByIdAndUpdate(
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
            const updatedItem = await Item.findByIdAndUpdate(
                itemID,
                {
                    $set: {
                        parent: {
                            id: new mongoose.mongo.ObjectId(destination.id),
                            type: destination.type
                        }
                    }
                },
                {
                    upsert: false,
                    new: true
                }
            );

            await ChangelogController.log_move(updatedItem, originObj, destinationObj, req.user.id);

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

            const deletedItem = await Item.findByIdAndDelete(itemID);

            await ChangelogController.log_deletion(deletedItem, req.user.id);

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

        objAndInfo.validation = StorageController.validate_storage_object(newItem);

        if(!objAndInfo.validation.valid) {
            return objAndInfo;
        }

        // Create item in db
        const item = await Item.create(newItem);

        await ChangelogController.log_creation(item, item.owner);

        // Add id to return
        objAndInfo.newObj.id = new mongoose.mongo.ObjectId(item.id);

        return objAndInfo;
    },

}

module.exports = StorageController;
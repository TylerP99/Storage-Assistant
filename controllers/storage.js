// Storage controller
const mongoose = require("mongoose");
const Location = require("../models/StorageLocation.js");
const Container = require("../models/Container.js");
const Item = require("../models/Item.js");

module.exports = {

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
            objAndInfo = await this.create_new_container(newObj);
        }

        if( objType == "item") {
            // Function creates item, adds to db, and returns content object to add to location
            objAndInfo = await this.create_new_item(newObj);
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
                    return await delete_container(x.id);
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
                objAndInfo = await this.create_container(newObj);
            }
            else if( newObjType == "item") {
                objAndInfo = await this.create_item(newObj);
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
                                id: container.id,
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
                                id: container.id,
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

    delete_container: async (req, res, next) => {

        // Start Here today
    },

    // Helper methods

    create_container: async () => {

    },

    delete_container_helper: async () => {

    },

    //========================//
    //    Item Controllers    //
    //========================//

    // Routed methods

    update_item: async (req, res, next) => {

    },

    move_item: async (req, res, next) => {

    },

    delete_item: async (req, res, next) => {

    },

    // Helper methods

    create_item: async (item) => {

    }

}
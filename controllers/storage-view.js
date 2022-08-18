// Storage views controller
const Location = require("../models/StorageLocation");
const Container = require("../models/Container");
const Item = require("../models/Item");
const { findById } = require("../models/StorageLocation");

const StorageViewController = {
    get_dashboard: async (req, res, next) => {
        try{
            // Get all user locations
            const locations = await Location.find( {owner:req.user.id} );

            // Render ejs
            res.render("dashboard.ejs", { locations:locations });
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    get_location_view: async (req, res, next) => {
        const locationID = req.params.id;

        try {
            // Get location from id provided
            const location = await Location.findById(locationID);

            // Get contents from location
            let containers = [];
            let items = [];
            location.contents.forEach(x => {
                if(x.type == "container") {
                    containers.push(x.id);
                }
                else if(x.type == "item") {
                    items.push(x.id);
                }
                else {
                    // Invalid type?
                }
            });

            containers = await Container.find( {id: {$in: containers} });
            items = await Item.find( {id: {$in:items }});

            // Render ejs
            res.render({location:location, containers:containers, items:items});
        }
        catch(e) {
            console.error(e);
            next(e);
        }

    },

    get_container_view: async (req, res, next) => {
        // Container ownership should be identified by middleware before this function
        const containerID = req.params.id;

        try{
            // Get container from id provided
            const container = await Container.findById(containerID);

            // Get contents from container
            let containers = [];
            let items = [];
            container.contents.forEach(x => {
                if(x.type == "container") {
                    containers.push(x.id);
                }
                else if(x.type == "item") {
                    items.push(x.id);
                }
                else {
                    // Invalid type?
                }
            });

            containers = await Container.find( {id: {$in: containers} });
            items = await Item.find( {id: {$in:items }});

            // Get move destinations for container (invalid move locations are the container itself, its parent, and any of its descendants)
            const parentID = container.parent.id;
            

            // Render ejs
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    get_item_view: async (req, res, next) => {
        // Get item from id provided

        // Get move destinations for item (invalid move location is the item parent)

        // Render ejs
    },
};

module.exports = StorageViewController;
// Storage views controller
const Location = require("../models/StorageLocation");
const Container = require("../models/Container");
const Item = require("../models/Item");

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
        // Get location from id provided

        // Get contents from location

        // Render ejs

    },

    get_container_view: async (req, res, next) => {
        // Get container from id provided

        // Get contents from container

        // Get move destinations for container (invalid move locations are the container itself, its parent, and any of its descendants)

        // Render ejs

    },

    get_item_view: async (req, res, next) => {
        // Get item from id provided

        // Get move destinations for item (invalid move location is the item parent)

        // Render ejs
    },
};

module.exports = StorageViewController;
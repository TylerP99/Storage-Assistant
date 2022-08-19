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
        const locationID = req.params.id;

        try {
            // Get location from id provided
            const location = await Location.findById(locationID);

            // Get contents from location
            const contents = await StorageViewController.get_contents(location);
            const containers = contents.containers;
            const items = contents.items;

            // Render ejs
            res.render("storage-location-view.ejs", {location:location, containers:containers, items:items});
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
            const contents = await StorageViewController.get_contents(container);

            // Get move destinations for container (invalid move locations are the container itself, its parent, and any of its descendants)
            const parentID = container.parent.id;
            console.log(parentID);
            const invalidMoveIDs = await StorageViewController.get_descendants(containerID);
            invalidMoveIDs.push(parentID.toString());
            invalidMoveIDs.push(container.id);

            console.log("Invalid move ids:")
            console.log(invalidMoveIDs);

            let destinations = await Location.find({owner: req.user.id});
            destinations = destinations.concat(await Container.find({owner: req.user.id}));
            destinations = destinations.filter( x => !invalidMoveIDs.includes(x.id));

            // Render ejs
            res.render("container-view.ejs", {container:container, containers: contents.containers, items: contents.items, destinations:destinations});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    get_item_view: async (req, res, next) => {
        const itemID = req.params.id;

        try{
            // Get item from id provided
            const item = await Item.findById(itemID);

            // Get move destinations for item (invalid move location is the item parent)
            let destinations = await Location.find({owner: req.user.id});
            destinations = destinations.concat( await Container.find({owner: req.user.id}));
            destinations = destinations.filter( x => x.id != item.parent.id);

            // Render ejs
            res.render("item-view.ejs", {item:item, destinations:destinations});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    // Helpers
    get_contents: async (DBItem) => {
        // Get contents
        let containers = [];
        let items = [];
        DBItem.contents.forEach(x => {
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

        containers = await Container.find( {"_id": {$in: containers} });
        items = await Item.find( {"_id": {$in:items }});

        return {containers:containers, items:items};
    },

    get_descendants: async (containerID) => {
        const container = await Container.findById(containerID);

        // Get container contents, need all containers that are descendants
        const contents = await StorageViewController.get_contents(container);

        let descendants = contents.containers.map( x => x.id );

        for(let i = 0; i < contents.containers.length; ++i) {
            const newDescendants = await StorageViewController.get_descendants(contents.containers[i]);
            descendants = descendants.concat( newDescendants );
        }

        return descendants;
    },
};

module.exports = StorageViewController;
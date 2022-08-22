// Tracks certain operations within the database
// Idk which ones I want to track, so I could track them all..?

// When a storage object name is referenced, it should be appended with its type: Object [Type]
// EX: Storage Location [Location]
// EX: Storage Item [Item]: From Container A [Container] --> Container B [Container]

const Changelog = require("../models/Changelog");

module.exports = {
    create_log_document: async (userID) => {
        await Changelog.create({owner: userID});
    },
    // Log creation
    log_creation: async (obj, userID) => {
        let entry = `[Creation]: ${obj.name} [${obj.type}] created`;

        await Changelog.findOneAndUpdate(
            {owner: userID},
            {
                $push: {
                    log: {
                        entry: entry,
                        type: "creation"
                    }
                }
            },
            { upsert:false }
        );
    },
    // Log addition
    log_addition: async (addedObj, targetObj, userID) => {
        console.log("addedObj");
        console.log(addedObj);
        let entry = `[Addition]: ${addedObj.name} [${addedObj.type}] added to ${targetObj.name} [${targetObj.type}]`;

        await Changelog.findOneAndUpdate(
            {owner: userID},
            {
                $push: {
                    log: {
                        entry: entry,
                        type: "addition"
                    }
                }
            },
            { upsert:false }
        );
    },
    // Log update
    log_update: async (newObj, oldObj ,userID) => {
        let entry = `[Update]: ${oldObj.name} [${oldObj.type}] updated to ${newObj.name} [${newObj.type}]`;

        await Changelog.findOneAndUpdate(
            {owner: userID},
            {
                $push: {
                    log: {
                        entry: entry,
                        type: "update"
                    }
                }
            },
            { upsert:false }
        );
    },
    // Log move
    log_move: async (targetObj, originObj, destinationObj, userID) => {
        let entry = `[Move]: ${targetObj.name} [${targetObj.type}] moved from ${originObj.name} [${originObj.type}] to ${destinationObj.name} [${destinationObj.type}]`;

        await Changelog.findOneAndUpdate(
            {owner: userID},
            {
                $push: {
                    log: {
                        entry: entry,
                        type: "move"
                    }
                }
            },
            { upsert:false }
        );
    },
    // Log delete
    log_deletion: async (obj, userID) => {
        let entry = `[Deletion]: ${obj.name} [${obj.type}] deleted`;

        await Changelog.findOneAndUpdate(
            {owner: userID},
            {
                $push: {
                    log: {
                        entry: entry,
                        type: "deletion"
                    }
                }
            },
            { upsert:false }
        );
    }
}
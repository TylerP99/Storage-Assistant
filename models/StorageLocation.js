const mongoose = require("mongoose");

const StorageLocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    contents: {
        type: Array,
        default: []
    },
    length: {
        type: String,
        required: false
    },
    width: {
        type: String,
        required: false
    },
    height: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now()
    },
    type: {
        type: String,
        default: "location"
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    }
});

const StorageLocation = mongoose.model("StorageLocation", StorageLocationSchema);

module.exports = StorageLocation;
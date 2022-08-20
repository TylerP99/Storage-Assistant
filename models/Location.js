const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 50
    },
    description: {
        type: String,
        max: 250,
    },
    contents: {
        type: Array,
        default: []
    },
    length: {
        type: String,
        max: 50
    },
    width: {
        type: String,
        max: 50
    },
    height: {
        type: String,
        max: 50
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        default: "location"
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const Location = mongoose.model("Location", LocationSchema);

module.exports = Location;
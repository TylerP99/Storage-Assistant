const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50
    },
    description: {
        type: String,
        maxLength: 250,
    },
    contents: {
        type: Array,
        default: []
    },
    length: {
        type: String,
        maxLength: 50
    },
    width: {
        type: String,
        maxLength: 50
    },
    height: {
        type: String,
        maxLength: 50
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
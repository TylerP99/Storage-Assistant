const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 50
    },
    description: {
        type: String,
        max: 250
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    estimatedValue: {
        type: String,
        max: 50,
        default: "0"
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
    parent: {
        id: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        default: "item"
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
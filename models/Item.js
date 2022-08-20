const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50
    },
    description: {
        type: String,
        maxLength: 250
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    estimatedValue: {
        type: String,
        maxLength: 50,
        default: "0"
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
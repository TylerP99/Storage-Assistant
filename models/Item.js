const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    estimatedValue: {
        type: String,
        default: "0"
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
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    }
});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
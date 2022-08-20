const mongoose = require("mongoose");

const ContainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50
    },
    description: {
        type: String,
        maxLength: 250
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
        default: "container"
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const Container = mongoose.model("Container", ContainerSchema);

module.exports = Container;
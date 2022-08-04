const mongoose = require("mongoose");

const ContainerSchema = new mongoose.Schema({
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
    parent: {
        type:mongoose.Types.ObjectId,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    }
});

const Container = mongoose.model("Container", ContainerSchema);

module.exports = Container;
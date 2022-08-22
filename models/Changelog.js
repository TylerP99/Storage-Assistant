const mongoose = require("mongoose");

const ChangelogSchema = new mongoose.Schema({

    log: {
        type: Array,
        default: []
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    }

});

const Changelog = mongoose.model("Changelog", ChangelogSchema);

module.exports = Changelog;
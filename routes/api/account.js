const express = require("express");

const router = express.Router();

const User = require("../../models/User.js");

const bcrypt = require("bcrypt");


//Create account
router.post("/create", (req, res) => {
    const account = req.body.account;
    console.log(req.body.account);
    res.json("Received");

    const valid = validate_account(account);

    if(!valid) 
    {
        // Send back info
    }

    // Add to database, send back success

});

async function validate_account(account) {
    let valid = true;
    // Ensure email is unique

    // Ensure password1 meets requirements

    // Ensure password2 matches password1

    // For now, just return true so I can make database additions
    return valid;
}

module.exports = router
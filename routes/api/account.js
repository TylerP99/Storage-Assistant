const express = require("express");

const router = express.Router();

const User = require("../../models/User.js");

const bcrypt = require("bcrypt");
const saltRounds = 10;


//Create account
router.post("/create", async (req, res) => {
    const account = req.body.account;

    const valid = validate_account(account);

    if(valid) {
        // Add to database, send back success
        bcrypt.hash(account.password1, saltRounds, async (err, hash) => {
            const newAccount = {
                email: account.email,
                password: hash
            }
            await User.create(newAccount);
        });
    }

    res.json(valid);
});

async function validate_account(account) {
    const MIN_PASSWORD_LEN = 6;

    // Validation object that contains overall valid boolean, and error booleans for client side warnings
    let validation = {
        valid: true,
        errors: {
            emailInUse: false,
            passwordWeak: false,
            passwordNotMatch: false
        }
    };
    // Ensure email is unique
    const emailInUse = await User.findOne({email: account.email});

    if(emailInUse) {
        validation.valid = false;
        validation.errors.emailInUse = true;
    }

    // Ensure password1 meets requirements
    if(account.password1.length < MIN_PASSWORD_LEN) {
        validation.valid = false;
        validation.errors.passwordWeak = true;
    }

    // Ensure password2 matches password1
    if(account.password1 !== account.password2) {
        validation.valid = false;
        validation.errors.passwordNotMatch = true;
    }

    return validation;
}

module.exports = router
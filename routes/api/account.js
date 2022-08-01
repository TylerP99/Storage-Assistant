const express = require("express");

const router = express.Router();

const passport = require("passport");

const User = require("../../models/User.js");

const bcrypt = require("bcrypt");
const saltRounds = 10;


//Create account
router.post("/create", async (req, res) => {
    const account = req.body.account;

    const valid = await validate_account(account);

    if(valid.valid) {
        // Add to database, send back success
        try {
            const hashedPassword = await bcrypt.hash(account.password1, saltRounds);
            const newAccount = {
                email: account.email,
                password: hashedPassword
            }
            await User.create(newAccount);
            console.log("Account Created");
        }
        catch(e) {
            console.error(e);
            // Send bad res
        }
    }

    res.json(valid);
});

async function validate_account(account) {
    const MIN_PASSWORD_LEN = 6;

    console.log(account);

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




//LOGIN/Authenticate Account Route
router.post("/authenticate", (req,res,next) => {
    console.log("Passport auth");

    passport.authenticate("local", (e, user, info, status) => {
        if(e) {
            console.log("err")
            return next(err);
        }
        if(!user) {
            console.log("res sent")
            return res.status(401).json({success:false, error:info.message}).end();
        }

        req.login(user, err => {
            console.log("Log in");
            if(err) {
                return next(err);
            }
            res.json({success:true, error:""});
        })
    })(req,res,next);
});


module.exports = router;
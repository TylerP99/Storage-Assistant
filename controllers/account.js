//New user controller
const User = require("../models/User.js");

const bcrypt = require("bcrypt");

const passport = require("passport");

const AccountController = {

    // Create account
    /*
        body: {
            new account information to be added
            account: {
                email
                password1
                password2
            }
        }
    */
    create_account: async (req, res, next) => {
        const account = req.body.account;
        const saltRounds = 10

        const validation = await AccountController.validate_account(account);

        if(!validation.valid) {
            return res.status(400).json(validation);
        }

        try{
            const hashedPassword = await bcrypt.hash(account.password1, saltRounds);
            const newAccount = {
                email: account.email,
                password: hashedPassword
            };

            await User.create(newAccount);

            res.status(200).json(validation);
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    // Authenticate account
    /*
        body: {
            email,
            password
        }
        Used by passport local strategy
    */
    authenticate_account: (req,res,next) => {
        passport.authenticate(
            "local",
            (err, user, info, status) => {
                if(err) {
                    console.error(err);
                    return next(err);
                }

                if(!user) {
                    console.error("No user");
                    return res.status(400).json(
                        {success:false,
                        error:info.message}
                    );
                }

                req.login(user, (err) => {
                    if(err) {
                        return next(err);
                    }
                    res.status(200).json({success:true});
                });
            }
        )(req,res,next);
    },

    // Logout account
    logout_account: (req, res, next) => {
        req.logout((e) => {
            if(e) {
                console.error(e);
                return res.json({valid:false});
            }
            res.json({valid:true});
        });
    },

    // Update account

    // Delete account

    // Validate account
    validate_account: async (account) => {
        const MIN_PASSWORD_LEN = 8;

        const validation = {
            valid: true,
            errors: []
        };

        const emailInUse = await User.findOne(
            { email: account.email }
        );

        if(emailInUse) {
            validation.valid = false;
            validation.errors.push("Email in use");
        }

        if(account.password1.length < MIN_PASSWORD_LEN) {
            validation.valid = false;
            validation.errors.push("Password too short");
        }

        if(account.password1 !== account.password2) {
            validation.valid = false;
            validation.errors.push("Passwords do not match");
        }

        return validation;
    }
}

module.exports = AccountController;
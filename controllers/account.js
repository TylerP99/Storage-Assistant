//New user controller
const User = require("../models/User.js");
const Changelog = require("../models/Changelog");

const bcrypt = require("bcrypt");

const passport = require("passport");

const ChangelogController = require("./changelog");

const StorageAPIController = require("./storage-api");

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

            const newUser = await User.create(newAccount);

            // Also, create user's changelog
            await ChangelogController.create_log_document(newUser.id);

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
    update_account_email: async (req,res,next) => {
        const email = req.body.email;
        const validation = {
            valid: true,
            errors: {
                emailErrors: {
                    emailEmpty: false,
                    emailInUse: false
                }
            }
        }

        if(email == undefined) {
            validation.valid = false;
            validation.errors.emailErrors.emailEmpty = true;
        }

        try {
            const emailTest = await User.findOne({email: email});

            if(emailTest) {
                validation.valid = false;
                validation.errors.emailErrors.emailInUse = true;
            }

            if(!validation.valid) {
                return res.status(400).json(validation);
            }

            await User.findByIdAndUpdate(
                req.user.id,
                {
                    $set: {
                        email: email
                    }
                },
                {
                    upsert: false
                }
            );

            res.status(200).json(validation);
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    update_account_password: async (req, res, next) => {
        const saltRounds = 10;
        // Req should provide the old password, the new password, and a new password confirmation
        const oldPassword = req.body.oldPassword;
        const newPassword1 = req.body.newPassword1;
        const newPassword2 = req.body.newPassword2;

        const validation = {
            valid: true,
            errors: {
                passwordErrors: {
                    passwordShort: false,
                    passwordsNotMatch: false,
                    oldPasswordIncorrect: false
                }
            }
        }

        // Validate new password
        if(newPassword1.length < 8) {
            // Password too short
            validation.valid = false;
            validation.errors.passwordErrors.passwordShort = true;
        }
        if(newPassword1 != newPassword2) {
            // Passwords dont match
            validation.valid = false;
            validation.errors.passwordErrors.passwordsNotMatch = true;
        }

        if(!validation.valid) {
            return res.status(400).json(validation);
        }

        try {
            // Get user from db for password
            const user = await User.findById(req.user.id);

            // Old password needs to match database password
            const match = await bcrypt.compare(oldPassword, user.password);

            if(!match) {
                // Bad, return bad response
                validation.valid = false;
                validation.errors.passwordErrors.oldPasswordIncorrect = true;

                return res.status(400).json(validation);
            }

            const newHashedPassword = await bcrypt.hash(newPassword1, saltRounds);

            await User.findByIdAndUpdate(
                req.user.id,
                {
                    $set: {
                        password: newHashedPassword
                    },
                },
                {
                    upsert: false
                }
            );

            res.status(200).json(validation);
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    // Delete account
    delete_account: async (req, res, next) => {
        // Need to delete all info tied to the account
        try{
            // Delete changelog
            await Changelog.findOneAndDelete({owner:req.user.id});

            // Delete locations (which should delete containers and items)

            // Delete account
            await User.findByIdAndRemove(req.user.id);

            res.status(200).json({valid:true});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    // Validate account
    validate_account: async (account) => {
        const MIN_PASSWORD_LEN = 8;

        const validation = {
            valid: true,
            errors: {
                emailInUse: false,
                passwordWeak: false,
                passwordNotMatch: false
            }
        };

        const emailInUse = await User.findOne(
            { email: account.email }
        );

        if(emailInUse) {
            validation.valid = false;
            validation.errors.emailInUse = true;
        }

        if(account.password1.length < MIN_PASSWORD_LEN) {
            validation.valid = false;
            validation.errors.passwordWeak = true;;
        }

        if(account.password1 !== account.password2) {
            validation.valid = false;
            validation.errors.passwordNotMatch = true;
        }

        return validation;
    }
}

module.exports = AccountController;
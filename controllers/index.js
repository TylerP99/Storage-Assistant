// Index views controller

const Changelog = require("../models/Changelog");

const indexViewController = {
    // Landing page
    get_landing: (req,res,next) => {
        res.render("landing.ejs");
    },

    // Login
    get_login: (req,res,next) => {
        res.render("login.ejs");
    },

    // Register
    get_register: (req,res,next) => {
        res.render("register.ejs");
    },

    // Settings
    get_settings: (req,res,next) => {
        res.render("settings.ejs");
    },

    // Logout
    get_logout: (req,res,next) => {
        res.render("logout.ejs");
    },

    get_changelog: async (req, res, next) => {
        const changelog = await Changelog.findOne( {owner: req.user.id} );

        res.render("changelog.ejs", {changelog: changelog.log});
    },

    // 404
    get_404: (req,res,next) => {
        res.render("404.ejs");
    },

    // 403
    get_403: (req,res,next) => {
        res.render("403.ejs");
    },
};

module.exports = indexViewController;
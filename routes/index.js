const express = require("express");

const router = express.Router();



// Root/Landing Route
router.get("/", /*forwardAuthenticate,*/ (req, res) => {
    console.log("GET landing");
    res.render("landing.ejs");
});


module.exports = router;
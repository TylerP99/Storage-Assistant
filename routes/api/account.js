const express = require("express");

const router = express.Router();


//Create account
router.post("/create", (req, res) => {
    console.log(req.body.account);
    res.json("Received");
});

module.exports = router
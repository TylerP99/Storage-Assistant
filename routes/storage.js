// Storage router
const express = require("express");
const { ensureAuthenticated } = require("../config/auth-middleware");

const router = express.Router();

// Root/Dashboard
router.get("/", ensureAuthenticated, get_dashboard);

// Location view
router.get("/location/:id", ensureAuthenticated, get_location_view);

// Container view
router.get("/container/:id", ensureAuthenticated, get_container_view);

// Item view
router.get("/item/:id", ensureAuthenticated, get_item_view)

module.exports = router;
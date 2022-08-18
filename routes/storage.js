// Storage router
const express = require("express");
const { ensureAuthenticated } = require("../config/auth-middleware");

const router = express.Router();

const StorageViewController = require("../controllers/storage-view");

// Root/Dashboard
router.get("/", ensureAuthenticated, StorageViewController.get_dashboard);

// Location view
router.get("/location/:id", ensureAuthenticated, StorageViewController.get_location_view);

// Container view
router.get("/container/:id", ensureAuthenticated, StorageViewController.get_container_view);

// Item view
router.get("/item/:id", ensureAuthenticated, StorageViewController.get_item_view)

module.exports = router;
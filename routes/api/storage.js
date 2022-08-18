// New router, using controller imports
const express = require("express");
const { ensureAuthenticated } = require("../../config/auth-middleware");
const router = express.Router();

const storageController = require("../../controllers/storage-api");



//======================//
//   Location routes    //
//======================//

// Create location
router.post("/location/create", ensureAuthenticated, storageController.create_location);

// Update location
router.put("/location/update", ensureAuthenticated, storageController.update_location);

// AddTo location
router.put("/location/addTo", ensureAuthenticated, storageController.add_to_location);

// Delete location
router.delete("/location/delete", ensureAuthenticated, storageController.delete_location);

//======================//
//   Container routes   //
//======================//

// Update container
router.put("/container/update", ensureAuthenticated, storageController.update_container);

// AddTo container
router.put("/container/addTo", ensureAuthenticated, storageController.add_to_container);

// Move container
router.put("/container/move", ensureAuthenticated, storageController.move_container);

// Delete container
router.delete("/container/delete", ensureAuthenticated, storageController.delete_container);

//======================//
//     Item routes      //
//======================//

// Update item
router.put("/item/update", ensureAuthenticated, storageController.update_item);

// Move item
router.put("/item/move", ensureAuthenticated, storageController.move_item);

// Delete item
router.delete("/item/delete", ensureAuthenticated, storageController.delete_item);

module.exports = router;
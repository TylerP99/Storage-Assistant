/*===============================================*/
/*          Button and Form Handlers             */
/*===============================================*/
// Element id for database
const locationID = document.querySelector("body").id;

// Forms are handled in the order they appear within storage-location-view.ejs

//=========================//
// Update Storage Location //
//=========================//
const updateLocationButton = document.querySelector(".update-location-button");
const updateLocationForm = document.querySelector(".update-location-form");

// Toggle update location form open and close
updateLocationButton.addEventListener("click", () => {
    updateLocationForm.classList.toggle("hidden");
});

updateLocationForm.addEventListener("submit", update_location);

async function update_location(event) {
    // Prevent default form submission
    event.preventDefault();

    // Get target form
    const form = event.target;

    // Construct new location object from form fields
    const updatedLocation = {
        name: form.querySelector("#location-name-update").value,
        description: form.querySelector("#location-description-update").value,
        length: form.querySelector("#location-length-update").value,
        width: form.querySelector("#location-width-update").value,
        height: form.querySelector("#location-height-update").value
    };

    // Construct request data object
    const reqData = {
        location: updatedLocation,
        id: locationID
    };

    // Define route to send request
    const reqLoc = "/api/storage/update/StorageLocation";

    // Define type of request
    const reqType = "PUT";

    // Send request and handle response
    request_and_handle_res(reqData, reqLoc, reqType);
}

//=========================//
// Delete Storage Location //
//=========================//
const deleteLocationButton = document.querySelector(".delete-location-button");
const deleteLocationForm = document.querySelector(".delete-location-form");

deleteLocationButton.addEventListener("click", () => {
    deleteLocationForm.classList.toggle("hidden");
});

deleteLocationForm.addEventListener("submit", delete_location);

async function delete_location(event) {
    // Prevent default form submission
    event.preventDefault();

    // Prepare request data object
    const reqData = {
        id: locationID
    }

    // Define route for request
    const reqLoc = "/api/storage/delete/StorageLocation";

    // Define request type
    const reqType = "DELETE";

    // Send request
    const res = await fetch(
        reqLoc,
        {
            method: reqType,
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(reqData)
        }
    )

    const data = await res.json();

    if(!data.valid) {
        console.error(data.errors);
        return;
    }

    window.location.replace("/dashboard");
}


//===================//
// Add new Container //
//===================//
const addContainerButton = document.querySelector(".add-container-button");
const addContainerForm = document.querySelector(".add-container-to-location-form");

addContainerButton.addEventListener("click", () => {
    addContainerForm.classList.toggle("hidden")
});

addContainerForm.addEventListener("submit", add_container_to_location);

async function add_container_to_location(event) {
    // Prevent default form submission
    event.preventDefault();

    // Get form from event
    const form = event.target;

    // Construct new container object
    const container = {
        name: form.querySelector("#container-name").value,
        description: form.querySelector("#container-description").value,
        length: form.querySelector("#container-length").value,
        width: form.querySelector("#container-width").value,
        height: form.querySelector("#container-height").value
    }

    // Construct request data object containing container to add, the type of object to add, and the id of the location to add to
    const reqData = {
        obj: container,
        type: "container",
        id: locationID
    }

    // Define the route to take to add to location
    const reqLoc = "/api/storage/add/StorageLocation"

    // Define the type of request
    const reqType = "PUT";

    // Send request and handle the response
    await request_and_handle_res(reqData, reqLoc, reqType);
}

//==============//
// Add new Item //
//==============//
const addItemButton = document.querySelector(".add-item-button");
const addItemForm = document.querySelector(".add-item-to-location-form");

addItemButton.addEventListener("click", () => {
    addItemForm.classList.toggle("hidden");
});

addItemForm.addEventListener("submit", add_item_to_location);

async function add_item_to_location(event) {
    // Prevent default form submission
    event.preventDefault();

    // Get form from event
    const form = event.target;

    // Construct new item from form data
    const item = {
        name: form.querySelector("#item-name").value,
        description: form.querySelector("#item-description").value,
        quantity: form.querySelector("#item-quantity").value,
        estimatedValue: form.querySelector("#item-value").value,
        length: form.querySelector("#item-length").value,
        width: form.querySelector("#item-width").value,
        height: form.querySelector("#item-height").value
    };

    // Construct request data object
    const reqData = {
        obj: item,
        type: "item",
        id: locationID
    };

    // Define location of request
    const reqLoc = "/api/storage/add/StorageLocation";

    // Define request type
    const reqType = "PUT"

    // Send request and handle the response
    await request_and_handle_res(reqData, reqLoc, reqType);
}




//====================================//
//          Request Handler           //
//====================================//

async function request_and_handle_res(reqData, reqLoc, reqType, error_function) {
    // Make request to target route
    const response = await fetch(
        reqLoc,
        {
            method:reqType,
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(reqData)
        }
    )

    // Parse response to check for errors
    const data = await response.json();

    console.log(data);

    // If there are errors, handle them
    if(!data.valid) {
        return
    }

    // Otherwise, reload the page to display the page
    window.location.reload();
}
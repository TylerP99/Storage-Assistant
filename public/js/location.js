/*===============================================*/
/*          Button and Form Handlers             */
/*===============================================*/
// Element id for database
const locationID = document.querySelector("body").id;

// Forms are handled in the order they appear within storage-location-view.ejs

//=========================//
// Update Storage Location //
//=========================//
const updateLocationForm = document.querySelector(".update-location-form");

updateLocationForm.addEventListener("submit", update_location);

async function update_location(event) {
    // Prevent default form submission
    event.preventDefault();

    // Get target form
    const form = event.target;

    // Construct new location object from form fields
    const updatedLocation = {
        name: form.querySelector("#name").value,
        description: form.querySelector("#description").value,
        length: form.querySelector("#length").value,
        width: form.querySelector("#width").value,
        height: form.querySelector("#height").value
    };

    // Construct request data object
    const reqData = {
        location: updatedLocation,
        id: locationID
    };

    // Define route to send request
    const reqLoc = "/api/storage/location/update";

    // Define type of request
    const reqType = "PUT";

    // Send request and handle response
    request_and_handle_res(reqData, reqLoc, reqType, form);
}

//=========================//
// Delete Storage Location //
//=========================//
const deleteLocationForm = document.querySelector(".delete-location-form");

deleteLocationForm.addEventListener("submit", delete_location);

async function delete_location(event) {
    // Prevent default form submission
    event.preventDefault();

    // Prepare request data object
    const reqData = {
        id: locationID
    }

    // Define route for request
    const reqLoc = "/api/storage/location/delete";

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

    window.location.replace("/storage/");
}


//===================//
// Add new Container //
//===================//
const addContainerForm = document.querySelector(".add-container-to-location-form");

addContainerForm.addEventListener("submit", add_container_to_location);

async function add_container_to_location(event) {
    // Prevent default form submission
    event.preventDefault();

    // Get form from event
    const form = event.target;

    // Construct new container object
    const container = {
        name: form.querySelector("#name").value,
        description: form.querySelector("#description").value,
        length: form.querySelector("#length").value,
        width: form.querySelector("#width").value,
        height: form.querySelector("#height").value
    }

    // Construct request data object containing container to add, the type of object to add, and the id of the location to add to
    const reqData = {
        obj: container,
        type: "container",
        id: locationID
    }

    // Define the route to take to add to location
    const reqLoc = "/api/storage/location/addTo"

    // Define the type of request
    const reqType = "PUT";

    // Send request and handle the response
    await request_and_handle_res(reqData, reqLoc, reqType, form);
}

//==============//
// Add new Item //
//==============//
const addItemForm = document.querySelector(".add-item-to-location-form");

addItemForm.addEventListener("submit", add_item_to_location);

async function add_item_to_location(event) {
    // Prevent default form submission
    event.preventDefault();

    // Get form from event
    const form = event.target;

    // Construct new item from form data
    const item = {
        name: form.querySelector("#name").value,
        description: form.querySelector("#description").value,
        quantity: form.querySelector("#quantity").value,
        estimatedValue: form.querySelector("#value").value,
        length: form.querySelector("#length").value,
        width: form.querySelector("#width").value,
        height: form.querySelector("#height").value
    };

    // Construct request data object
    const reqData = {
        obj: item,
        type: "item",
        id: locationID
    };

    // Define location of request
    const reqLoc = "/api/storage/location/addTo";

    // Define request type
    const reqType = "PUT"

    // Send request and handle the response
    await request_and_handle_res(reqData, reqLoc, reqType, form);
}




//====================================//
//          Request Handler           //
//====================================//

async function request_and_handle_res(reqData, reqLoc, reqType, reqForm) {
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
        return error_handler(reqForm, data.errors);
    }

    // Otherwise, reload the page to display the page
    window.location.reload();
}

function error_handler(formElement, errors) {
    // Just check for each error, and adjust form accordingly
    // Forms will be changed to have generic input ids rather than object specific ones

    if(errors.nameErrors.undefined) {
        formElement.querySelector("#name").classList.add("error");
        formElement.querySelector("#name-error").innerText = "Name is required";
    }
    else if(errors.nameErrors.tooLarge) {
        formElement.querySelector("#name").classList.add("error");
        formElement.querySelector("#name-error").innerText = "Name is too long";
    }

    if(errors.descriptionErrors.tooLarge) {
        formElement.querySelector("#description").classList.add("error");
        formElement.querySelector("#description-error").innerText = "Description is too long";
    }

    if(errors.lengthErrors.tooLarge) {
        formElement.querySelector("#length").classList.add("error");
        formElement.querySelector("#length-error").innerText = "Length is too long";
    }

    if(errors.widthErrors.tooLarge) {
        formElement.querySelector("#width").classList.add("error");
        formElement.querySelector("#width-error").innerText = "Width is too long";
    }

    if(errors.heightErrors.tooLarge) {
        formElement.querySelector("#height").classList.add("error");
        formElement.querySelector("#height-error").innerText = "Height is too long";
    }

    if(errors.quantityErrors.tooLarge) {
        formElement.querySelector("#quantity").classList.add("error");
        formElement.querySelector("#quantity-error").innerText = "Quantity is too long";
    }

    if(errors.quantityErrors.negative) {
        formElement.querySelector("#quantity").classList.add("error");
        formElement.querySelector("#quantity-error").innerText = "Quantity cannot be negative";
    }

    if(errors.valueErrors.tooLarge) {
        formElement.querySelector("#value").classList.add("error");
        formElement.querySelector("#value-error").innerText = "Value is too long";
    }
}
// Open and close update form
const openUpdateLocationFormButton = document.querySelector(".open-update-storage-location-button");
openUpdateLocationFormButton.addEventListener("click", open_location_update_form);

const updateLocationForm = document.querySelector(".update-storage-location-form");

function open_location_update_form(event) {
    updateLocationForm.classList.toggle("hidden");
}

const locationID = document.querySelector("body").id;

const addContainerForm = document.querySelector(".add-container-to-storage-location-form");

addContainerForm.addEventListener("submit", add_container_to_location);

async function add_container_to_location(event) {
    event.preventDefault();

    const obj = {
        name: event.target.querySelector("#container-name").value,
        description: event.target.querySelector("#container-description").value,
        length: event.target.querySelector("#container-length").value,
        width: event.target.querySelector("#container-width").value,
        height: event.target.querySelector("#container-height").value
    }

    const reqData = {
        obj: obj,
        type: "container",
        id: locationID
    }
    const reqLoc = "/api/storage/add/StorageLocation"

    await request_and_handle_res(reqData, reqLoc, "PUT");
}

// Add Item to Location
const addItemForm = document.querySelector(".add-item-to-storage-location-form");

addItemForm.addEventListener("submit", add_item_to_location);

async function add_item_to_location(event) {
    event.preventDefault();

    const obj = {
        name: event.target.querySelector("#item-name").value,
        description: event.target.querySelector("#item-description").value,
        quantity: event.target.querySelector("#item-quantity").value,
        estimatedValue: event.target.querySelector("#item-value").value,
        length: event.target.querySelector("#item-length").value,
        width: event.target.querySelector("#item-width").value,
        height: event.target.querySelector("#item-height").value
    };

    const reqData = {
        obj:obj,
        type: "item",
        id: locationID
    };
    const reqLoc = "/api/storage/add/StorageLocation";

    await request_and_handle_res(reqData, reqLoc, "PUT");
}

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
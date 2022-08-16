/*===============================================*/
/*          Button and Form Handlers             */
/*===============================================*/
// GLOBAL CONSTANTS
const containerID = document.querySelector("body").id;

// Edit Container
const editContainerForm = document.querySelector(".edit-container-form");

editContainerForm.addEventListener("submit", edit_container)

async function edit_container(event) {
    event.preventDefault();

    const form = event.target;

    const updatedContainer = {
        name: form.querySelector("#container-name-update").value,
        description: form.querySelector("#container-description-update").value,
        length: form.querySelector("#container-length-update").value,
        width: form.querySelector("#container-width-update").value,
        height: form.querySelector("#container-height-update").value
    };

    const reqData = {
        container: updatedContainer,
        id: containerID
    };

    const reqLoc = "/api/storage/update/Container"

    const reqType = "PUT";

    request_and_handle_res(reqData, reqLoc, reqType);
}

// Move Container
const moveContainerForm = document.querySelector(".move-container-form");

moveContainerForm.addEventListener("submit", move_container)

async function move_container(event) {
    event.preventDefault();

    const form = event.target;
    const selection = event.target.querySelector(".destination");
    const option = selection.options[selection.selectedIndex];

    const reqData = {
        destination:{
            id: option.id,
            type: option.getAttribute("name")
        },
        id: containerID
    };

    const reqLoc = "/api/storage/move/Container"

    const reqType = "PUT";

    request_and_handle_res(reqData, reqLoc, reqType);
}

// Delete Container
const deleteContainerForm = document.querySelector(".delete-container-form");

deleteContainerForm.addEventListener("submit", delete_container)

async function delete_container(event) {
    event.preventDefault();

    const reqData = {
        id: containerID
    };

    const reqLoc = "/api/storage/delete/Container"

    const reqType = "DELETE";

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

    const backLocation = document.querySelector(".back-button").href;

    window.location.replace(backLocation);
}

// Add Container
const addContainerForm = document.querySelector(".add-container-to-container-form");

addContainerForm.addEventListener("submit", add_new_container)

async function add_new_container(event) {
    event.preventDefault();

    const form = event.target;

    const newContainer = {
        name: form.querySelector("#container-name").value,
        description: form.querySelector("#container-description").value,
        length: form.querySelector("#container-length").value,
        width: form.querySelector("#container-width").value,
        height: form.querySelector("#container-height").value
    }

    const reqData = {
        obj: newContainer,
        type: "container",
        id: containerID
    };

    const reqLoc = "/api/storage/add/Container"

    const reqType = "PUT";

    request_and_handle_res(reqData, reqLoc, reqType);
}

// Add Item
const addItemForm = document.querySelector(".add-item-to-container-form");

addItemForm.addEventListener("submit", add_new_item)

async function add_new_item(event) {
    event.preventDefault();

    const form = event.target;

    const newItem = {
        name: form.querySelector("#item-description").value,
        description: form.querySelector("#item-description").value,
        quantity: form.querySelector("#item-quantity").value,
        estimatedValue: form.querySelector("#item-value").value,
        length: form.querySelector("#item-length").value,
        width: form.querySelector("#item-width").value,
        height: form.querySelector("#item-height").value,
    };

    const reqData = {
        obj: newItem,
        type: "item",
        id: containerID
    };

    const reqLoc = "/api/storage/add/Container"

    const reqType = "PUT";

    request_and_handle_res(reqData, reqLoc, reqType);
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
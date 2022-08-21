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
        name: form.querySelector("#name").value,
        description: form.querySelector("#description").value,
        length: form.querySelector("#length").value,
        width: form.querySelector("#width").value,
        height: form.querySelector("#height").value
    };

    const reqData = {
        container: updatedContainer,
        id: containerID
    };

    const reqLoc = "/api/storage/container/update"

    const reqType = "PUT";

    request_and_handle_res(reqData, reqLoc, reqType, form);
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

    const reqLoc = "/api/storage/container/move"

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

    const reqLoc = "/api/storage/container/delete"

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
        name: form.querySelector("#name").value,
        description: form.querySelector("#description").value,
        length: form.querySelector("#length").value,
        width: form.querySelector("#width").value,
        height: form.querySelector("#height").value
    }

    const reqData = {
        obj: newContainer,
        type: "container",
        id: containerID
    };

    const reqLoc = "/api/storage/container/addTo"

    const reqType = "PUT";

    request_and_handle_res(reqData, reqLoc, reqType, form);
}

// Add Item
const addItemForm = document.querySelector(".add-item-to-container-form");

addItemForm.addEventListener("submit", add_new_item)

async function add_new_item(event) {
    event.preventDefault();

    const form = event.target;

    const newItem = {
        name: form.querySelector("#description").value,
        description: form.querySelector("#description").value,
        quantity: form.querySelector("#quantity").value,
        estimatedValue: form.querySelector("#value").value,
        length: form.querySelector("#length").value,
        width: form.querySelector("#width").value,
        height: form.querySelector("#height").value,
    };

    const reqData = {
        obj: newItem,
        type: "item",
        id: containerID
    };

    const reqLoc = "/api/storage/container/addTo"

    const reqType = "PUT";

    request_and_handle_res(reqData, reqLoc, reqType, form);
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
    };

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
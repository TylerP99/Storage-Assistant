// Get item id for use in form submissions
const itemID = document.querySelector("body").id;

// Update Item
const editItemForm = document.querySelector(".edit-item-form");

editItemForm.addEventListener("submit", edit_item);

async function edit_item(event) {
    event.preventDefault();

    const form = event.target;

    const item = {
        name: form.querySelector("#name").value,
        description: form.querySelector("#description").value,
        quantity: form.querySelector("#quantity").value,
        estimatedValue: form.querySelector("#value").value,
        length: form.querySelector("#length").value,
        width: form.querySelector("#width").value,
        height: form.querySelector("#height").value
    };

    const reqData = {
        item: item,
        id: itemID
    };

    const reqLoc = "/api/storage/item/update";

    const reqType = "PUT";

    console.log(reqData);

    await request_and_handle_res(reqData, reqLoc, reqType, form);
}


// Move Item
const moveItemForm = document.querySelector(".move-item-form");

moveItemForm.addEventListener("submit", move_item);

async function move_item(event) {
    event.preventDefault();

    const form = event.target;

    const selection = form.querySelector(".destination");
    const option = selection.options[selection.selectedIndex];

    const reqData = {
        destination: {
            id: option.id,
            type: option.getAttribute("name")
        },
        id: itemID
    };

    const reqLoc = "/api/storage/item/move";

    const reqType = "PUT";

    console.log(reqData);

    await request_and_handle_res(reqData, reqLoc, reqType, form);
}

// Delete Item
const deleteItemForm = document.querySelector(".delete-item-form");

deleteItemForm.addEventListener("submit", delete_item);

async function delete_item(event) {
    event.preventDefault();

    const reqData = {
        id: itemID
    };

    const reqLoc = "/api/storage/item/delete";

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
    );

    const data = await res.json();

    if(!data.valid) {
        return;
    }

    window.location.replace(document.querySelector(".back-button").href);
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
        return error_handler(reqForm, data.errors)
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
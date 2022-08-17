// Get item id for use in form submissions
const itemID = document.querySelector("body").id;

// Update Item
const editItemForm = document.querySelector(".edit-item-form");

editItemForm.addEventListener("submit", edit_item);

async function edit_item(event) {
    event.preventDefault();

    const form = event.target;

    const item = {
        name: form.querySelector("#item-name").value,
        description: form.querySelector("#item-description").value,
        quantity: form.querySelector("#item-quantity").value,
        estimatedValue: form.querySelector("#item-value").value,
        length: form.querySelector("#item-length").value,
        width: form.querySelector("#item-width").value,
        height: form.querySelector("#item-height").value
    };

    const reqData = {
        item: item,
        id: itemID
    };

    const reqLoc = "/api/storage/item/update";

    const reqType = "PUT";

    console.log(reqData);

    await request_and_handle_res(reqData, reqLoc, reqType);
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

    await request_and_handle_res(reqData, reqLoc, reqType);
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

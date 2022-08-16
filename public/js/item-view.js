const itemID = document.querySelector("body").id;

// Update Item
const editItemButton = document.querySelector(".edit-item-button");
const editItemForm = document.querySelector(".edit-item-form");
const editItemFormContainer = document.querySelector(".edit-item-form-container");

editItemButton.addEventListener("click", () => {
    editItemFormContainer.classList.toggle("hidden");
});

editItemFormContainer.addEventListener("click", (e) => {
    if(!e.target.closest(".edit-item-form")) {
        editItemFormContainer.classList.toggle("hidden");
    }
});

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

    const reqLoc = "/api/storage/update/Item";

    const reqType = "PUT";

    console.log(reqData);

    await request_and_handle_res(reqData, reqLoc, reqType);
}


// Move Item
const moveItemButton = document.querySelector(".move-item-button");
const moveItemForm = document.querySelector(".move-item-form");
const moveItemFormContainer = document.querySelector(".move-item-form-container");

moveItemButton.addEventListener("click", () => {
    moveItemFormContainer.classList.toggle("hidden");
});

moveItemFormContainer.addEventListener("click", (e) => {
    if(!e.target.closest(".move-item-form")) {
        moveItemFormContainer.classList.toggle("hidden");
    }
});

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

    const reqLoc = "/api/storage/move/Item";

    const reqType = "PUT";

    console.log(reqData);

    await request_and_handle_res(reqData, reqLoc, reqType);
}

// Delete Item
const deleteItemButton = document.querySelector(".delete-item-button");
const deleteItemForm = document.querySelector(".delete-item-form");
const deleteItemFormContainer = document.querySelector(".delete-item-form-container");

deleteItemButton.addEventListener("click", () => {
    deleteItemFormContainer.classList.toggle("hidden");
});

deleteItemFormContainer.addEventListener("click", (e) => {
    if(!e.target.closest(".delete-item-form")) {
        deleteItemFormContainer.classList.toggle("hidden");
    }
});

deleteItemForm.addEventListener("submit", delete_item);

async function delete_item(event) {
    event.preventDefault();

    const reqData = {
        id: itemID
    };

    const reqLoc = "/api/storage/delete/Item";

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

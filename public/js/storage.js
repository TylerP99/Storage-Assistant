// Storage request handler

// Storage Location Operations
// Create new storageLocation
const createLocationForm = document.querySelector(".create-storage-location-form");

createLocationForm.addEventListener("submit", create_new_container);

async function create_new_container(event) {
    event.preventDefault(); // Stop form from submitting itself

    // Grab items from form
    const name = document.querySelector("#location-name").value;
    const desc = document.querySelector("#location-description").value;
    const len = document.querySelector("#location-length").value;
    const wid = document.querySelector("#location-width").value;
    const hei = document.querySelector("#location-height").value;

    // Construct object from form
    const storageLocation = new StorageLocation(name, desc, len, wid, hei);

    const reqData = {
        location:storageLocation,
    }
    const reqLoc = "/api/storage/create/StorageLocation";

    // Send request containing storageLocation
    await request_and_handle_res(reqData, reqLoc, "POST", display);
}

// Update storage location properties
// There is a form for each storage location added, get them all
const updateLocationForms = document.querySelectorAll(".update-storage-location-form");

// Then add the event listeners to each form
updateLocationForms.forEach( x => {
    x.addEventListener("submit", update_storage_location);
});

async function update_storage_location(event) {
    event.preventDefault(); // Stop normal form submission

    // Grab items from form
    const name = event.target.querySelector("#location-name-update").value;
    const desc = event.target.querySelector("#location-description-update").value;
    const len  = event.target.querySelector("#location-length-update").value;
    const wid  = event.target.querySelector("#location-width-update").value;
    const hei  = event.target.querySelector("#location-height-update").value;
    const id   = event.target.parentElement.id;

    console.log(id);

    // Construct object
    const updatedLocation = new StorageLocation(name, desc, len, wid, hei);

    const reqData = {
        location: updatedLocation,
        id:id
    };
    const reqLoc = "/api/storage/update/StorageLocation";

    // Send put request to update properties
    await request_and_handle_res(reqData, reqLoc, "PUT", display);
}

// Add object to storageLocation
const addItemForms = document.querySelectorAll(".add-item-to-storage-location-form");
const addContainerForms = document.querySelectorAll(".add-container-to-storage-location-form");

// Add event listeners to all the forms for now
addItemForms.forEach( x => {
    x.addEventListener("submit",add_to_storage_location);
});
addContainerForms.forEach( x => {
    x.addEventListener("submit", add_to_storage_location);
});


async function add_to_storage_location(event) {
    // Prevent html form submission
    event.preventDefault();

    // Get data from form
    // Form will have dropdown menu that will submit type of object and form used

    const type = event.target.id;
    let obj = {};

    if(type == "container") {
        const name = event.target.querySelector("#container-name").value;
        const desc = event.target.querySelector("#container-description").value;
        const len  = event.target.querySelector("#container-length").value;
        const wid  = event.target.querySelector("#container-width").value;
        const hei  = event.target.querySelector("#container-height").value;
        obj = new Container(name,desc,len,wid,hei);
    }
    else if(type == "item") {
        const name = event.target.querySelector("#item-name").value;
        const desc = event.target.querySelector("#item-description").value;
        const quan = event.target.querySelector("#item-quantity").value;
        const val  = event.target.querySelector("#item-value").value;
        const len  = event.target.querySelector("#item-length").value;
        const wid  = event.target.querySelector("#item-width").value;
        const hei  = event.target.querySelector("#item-height").value;
        obj = new Item(name,desc,quan,val,len,wid,hei)
    }

    const reqData = {
        obj:obj,
        type:type,
        id: event.target.parentElement.id
    };
    const reqLoc = "/api/storage/add/StorageLocation";

    // Send request with obj to add and its type
    await request_and_handle_res(reqData, reqLoc, "PUT", display);
}

// Delete StorageLocation
const deleteLocationButtons = document.querySelectorAll(".delete-location-button");

deleteLocationButtons.forEach( x => {
    x.addEventListener("click", delete_storage_location);
});


async function delete_storage_location(event) {
    event.preventDefault();

    // Get id from object
    const reqData = {
        id:event.target.parentElement.parentElement.id
    };
    const reqLoc = "/api/storage/delete/StorageLocation";

    // Send request with id
    await request_and_handle_res(reqData, reqLoc, "DELETE", display);
}

// Container Operations

// Update container properties
async function update_container(event) {
    // Stop default form behavior
    event.preventDefault();

    // Get updated object from form
    const name = "";
    const desc = "";
    const len = "";
    const wid = "";
    const hei = "";
    // Get id from document
    const id = "";

    // Create storage obj
    const updatedContainer = new Container(name,desc,len,wid,hei);

    const reqData = {
        container:updatedContainer,
        id:id
    }
    const reqLoc = "/api/storage/update/Container";

    // Send obj and id in request
    await request_and_handle_res(reqData, reqLoc, "PUT", display);
}

// Add to container
async function add_to_container(event) {
    // Prevent default form submission
    event.preventDefault();

    // Get data from form
    // Form will have dropdown menu that will submit type of object and form used
    const type = "";
    let obj = {};

    if(type == "container") {
        const name = "";
        const desc = "";
        const len = "";
        const wid = "";
        const hei = "";
        obj = new Container(name,desc,len,wid,hei);
    }
    else if(type == "item") {
        const name = "";
        const desc = "";
        const quan = "";
        const val = "";
        const len = "";
        const wid = "";
        const hei = "";
        obj = new Item(name,desc,quan,val,len,wid,hei)
    }

    const reqData = {
        obj:obj,
        type:type,
        id:""
    };
    const reqLoc = "/api/storage/add/Container";

    // Send request with id of container, obj to add, and type of obj
    await request_and_handle_res(reqData, reqLoc, "PUT", display);
}

// Delete Container
async function delete_container(event) {
    // Get id from object
    const reqData = {
        id:""
    };
    const reqLoc = "/api/storage/delete/Container";

    // Send delete request with id of container to be deleted
    await request_and_handle_res(reqData, reqLoc, "DELETE", display);
}


// Item Operations

// Update item properties
async function update_item(event) {
    // Prevent default form behavior
    event.preventDefault();

    // Get updated item from form
    const name = "";
    const desc = "";
    const quan = "";
    const val = "";
    const len = "";
    const wid = "";
    const hei = "";

    // Get item to update id
    const id = "";

    // Construct item
    const updatedItem = new Item(name,desc,quan,val,len,wid,hei);

    const reqData = {
        id:id,
        item:updatedItem
    };
    const reqLoc = "/api/storage/update/Item";

    // Send id and new item in request
    await request_and_handle_res(reqData, reqLoc, "PUT", display);
}

// Delete item
async function delete_item(event) {
    // Get id from html
    const reqData = {
        id:"id"
    };
    const reqLoc = "/api/storage/delete/Item";

    // Make delete request and send id
    await request_and_handle_res(reqData, reqLoc, "DELETE", display);
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
        return error_function(data.errors)
    }

    // Otherwise, reload the page to display the page
    console.log("Reload");
    location.reload();
    console.log("Reloaded");
}

function display(error) {
    //Placeholder until client side is more formed
    const errContainer = document.querySelector(".errors");
}

class StorageLocation {
    constructor(name,desc,len,wid,hei) {
        this.name = name;
        this.description = desc;
        this.length = len;
        this.width = wid;
        this.height = hei;
    }
}

class Container {
    constructor(name,desc,len,wid,hei) {
        this.name = name;
        this.description = desc;
        this.length = len;
        this.width = wid;
        this.height = hei;
    }
}

class Item {
    constructor(name, desc, quan, val, len, wid, hei) {
        this.name = name;
        this.description = desc;
        this.quantity = quan;
        this.estimatedValue = val;
        this.length = len;
        this.width = wid;
        this.height = hei;
    }
}
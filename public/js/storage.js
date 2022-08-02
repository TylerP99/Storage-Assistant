// Storage request handler

// Storage Location Operations
// Create new storageLocation
async function create_new_container(event) {
    event.preventDefault(); // Stop form from submitting itself

    // Grab items from form
    const name = "";
    const desc = "";
    const len = "";
    const wid = "";
    const hei = "";

    // Construct object from form
    const storageLocation = new StorageLocation(name, desc, len, wid, hei);

    const reqData = {
        location:storageLocation,
    }
    const reqLoc = "/api/storage/create/StorageLocation";

    // Send request containing storageLocation
    await request_and_handle_res(reqData, reqLoc, "PUT", display);
}

async function update_storage_location(event) {
    event.preventDefault(); // Stop normal form submission

    // Grab items from form
    const name = "";
    const desc = "";
    const len = "";
    const wid = "";
    const hei = "";
    const id = "";

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
async function add_to_storage_location(event) {
    // Prevent html form submission
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
    const reqLoc = "/api/storage/add/StorageLocation";

    // Send request with obj to add and its type
    await request_and_handle_res(reqData, reqLoc, "PUT", display);
}

// Delete StorageLocation
async function delete_storage_location(event) {
    event.preventDefault();

    // Get id from object
    const reqData = {
        id:""
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

    // If there are errors, handle them
    if(!data.valid) {
        return error_function(data.errors)
    }

    // Otherwise, reload the page to display the page
    window.location.reload;
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
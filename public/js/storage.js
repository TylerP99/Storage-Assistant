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

    // Send request containing storageLocation
    const response = await fetch(
        "/api/storage/create/StorageLocation",
        {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(storageLocation)
        }
    );

    // Should receive a validation object from response
    const data = await response.json();

    if(!data.valid) {
        return display_errors(errors);
    }

    // Reload page now to show new StorageLocation on page
    window.location.reload();
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

    // Send put request to update properties
    const response = await fetch(
        "/api/storage/update/StorageLocation",
        {
            method:"PUT",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                location: updatedLocation,
                id: id
            })
        }
    )

    // Parse response
    const data = await response.json();

    // Check validation object for next steps
    if(!data.valid) {
        return display_errors(data.errors);
    }

    // Reload page to see updates
    window.location.reload();
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

    // Send request with obj to add and its type
    const response = await fetch(
        "/api/storage/add/StorageLocation",
        {
            method:"PUT",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                obj:obj, 
                type:type
            })
        }
    );

    // Parse response and save
    const data = await response.json();

    // If invalid, provide feedback
    if(!data.valid) {
        return display_errors(data.errors);
    }

    // Reload page to see changes
    window.location.reload();
}

// Delete StorageLocation
async function delete_storage_location(event) {
    event.preventDefault();

    // Get id from object
    const id = "";

    // Send request with id
    const response = await fetch(
        "/api/storage/delete/StorageLocation",
        {
            method:"DELETE",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringigy({id:id});
        }
    )

    // Parse response
    const data = await response.json();

    if(!data.valid) {
        // Shouldn't be any user error since its a button press...
        return display_errors(data.errors);
    }

    // Reload window for changes
    window.location.reload();
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
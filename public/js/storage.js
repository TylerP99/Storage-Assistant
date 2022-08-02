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
    const updatedLocation = new StorageLocation(name, desc, len. wid, hei);

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
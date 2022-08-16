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

// Only need to be able to create a new location from here
const createLocationButton = document.querySelector(".create-location-button");
const createLocationForm = document.querySelector(".create-location-form");
const createLocationFormContainer = document.querySelector(".create-location-form-container");

createLocationButton.addEventListener("click", () => {
    createLocationFormContainer.classList.toggle("hidden");
});

// Close overlay if clicked off
createLocationFormContainer.addEventListener("click", (e) => {
    if(!e.target.closest(".create-location-form")) {
        createLocationFormContainer.classList.toggle("hidden");
    }
});

createLocationForm.addEventListener("submit", create_location);

async function create_location(event) {
    // Prevent default form submission
    event.preventDefault();

    // Get form from event
    const form = event.target;

    // Construct new location object from form data
    const newLocation = {
        name: form.querySelector("#location-name").value,
        description: form.querySelector("#location-description").value,
        length: form.querySelector("#location-length").value,
        width: form.querySelector("#location-width").value,
        height: form.querySelector("#location-height").value
    };

    // Construct request data object
    const reqData = {
        location: newLocation
    };

    // Define request route
    const reqLoc = "/api/storage/create/StorageLocation";

    // Define request type
    const reqType = "POST";

    // Send request
    request_and_handle_res(reqData, reqLoc, reqType)
}
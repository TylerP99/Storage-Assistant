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
    }

    // Otherwise, reload the page to display the page
    window.location.reload();
}

// Only need to be able to create a new location from here
const createLocationForm = document.querySelector(".create-location-form");

createLocationForm.addEventListener("submit", create_location);

async function create_location(event) {
    // Prevent default form submission
    event.preventDefault();

    // Get form from event
    const form = event.target;

    // Construct new location object from form data
    const newLocation = {
        name: form.querySelector("#name").value,
        description: form.querySelector("#description").value,
        length: form.querySelector("#length").value,
        width: form.querySelector("#width").value,
        height: form.querySelector("#height").value
    };

    // Construct request data object
    const reqData = {
        location: newLocation
    };

    // Define request route
    const reqLoc = "/api/storage/location/create";

    // Define request type
    const reqType = "POST";

    // Send request
    request_and_handle_res(reqData, reqLoc, reqType, form)
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
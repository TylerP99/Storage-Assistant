// Attemp to generically open and close all forms based on the structure of the form option section
// Reason: Make code a lot more DRY. A lot of the code is a bit specific and could be genralized greatly
/*

Basic Structure:

<section>

    <button class="open">Open</button>
    <section class="overlay">

        <form>
            //Inputs and stuff
        </form>

    </section>

</section>

*/

// Idea: add event listeners to all buttons, use event.target to get parent element, then queryselect for the overlay and open it. All overlays should also have their own event listeners making sure they close if they are clicked

// This code relies heavily on my html structure. Html structure changes should result in some code changes as needed

const formOpenButtons = document.querySelectorAll(".open-button");

formOpenButtons.forEach(x => x.addEventListener("click", open_form));

function open_form(event) {
    const overlay = event.target.parentElement.querySelector(".overlay");
    overlay.classList.toggle("hidden");
    console.log("Open sesame");
}


const formOverlays = document.querySelectorAll(".overlay");

formOverlays.forEach(x => x.addEventListener("click", click_off_form));

function click_off_form(event) {
    if(!event.target.closest("form")) {
        console.log("click off close")
        event.target.classList.toggle("hidden");
    }
}

// So far so good, adding to all view pages for testing
// Amazing... pushing this to github then refactoring the rest of the code

// Really quick, lets add those close buttons to the forms
const formCloseButtons = document.querySelectorAll(".close-button");

formCloseButtons.forEach(x=> x.addEventListener("click", close_form));

function close_form(event) {
    // event is a button whose parent is the form whose parent is the overlay
    event.preventDefault();
    console.log("Button close close")
    event.target.parentElement.parentElement.classList.toggle("hidden");
}


// Gonna try adding the generic delete operations here as well
// A delete operation requires: id of thing to be deleted

// Location Card Delete
const locationCardDeleteForms = document.querySelectorAll(".card-delete-location-form");
locationCardDeleteForms.forEach( x => x.addEventListener("submit", card_delete_location));

async function card_delete_location(event) {
    event.preventDefault();

    const form = event.target;

    const locationID = form.id;

    const reqData = {
        id: locationID
    };

    console.log(reqData);

    const reqLoc = "/api/storage/location/delete";

    const reqType = "DELETE";

    await request_and_handle_res(reqData, reqLoc, reqType);
}


// Container Card Delete
const containerCardDeleteForms = document.querySelectorAll(".card-delete-container-form");
containerCardDeleteForms.forEach( x => x.addEventListener("submit", card_delete_container));

async function card_delete_container(event) {
    event.preventDefault();

    const form = event.target;

    const containerID = form.id;

    const reqData = {
        id: containerID
    };

    console.log(reqData);

    const reqLoc = "/api/storage/container/delete";

    const reqType = "DELETE";

    await request_and_handle_res(reqData, reqLoc, reqType);
}

// Item Card Delete
const itemCardDeleteForms = document.querySelectorAll(".card-delete-item-form");
itemCardDeleteForms.forEach( x => x.addEventListener("submit", card_delete_item));

async function card_delete_item(event) {
    event.preventDefault();

    const form = event.target;

    const itemID = form.id;

    const reqData = {
        id: itemID
    };

    console.log(reqData);

    const reqLoc = "/api/storage/item/delete";

    const reqType = "DELETE";

    await request_and_handle_res(reqData, reqLoc, reqType);
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
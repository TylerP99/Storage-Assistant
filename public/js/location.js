// Open and close update form
const openUpdateLocationFormButton = document.querySelector(".open-update-storage-location-button");
openUpdateLocationFormButton.addEventListener("click", open_location_update_form);

const updateLocationForm = document.querySelector(".update-storage-location-form");

function open_location_update_form(event) {
    updateLocationForm.classList.toggle("hidden");
}

const locationID = document.querySelector("body").id;

const addContainerForm = document.querySelector(".add-container-to-storage-location-form");

addContainerForm.addEventListener("submit", add_container_to_location);

async function add_container_to_location(event) {
    event.preventDefault();

    const obj = {
        name: event.target.querySelector("#container-name").value,
        description: event.target.querySelector("#container-description").value,
        length: event.target.querySelector("#container-length").value,
        width: event.target.querySelector("#container-width").value,
        height: event.target.querySelector("#container-height").value
    }

    const reqData = {
        obj: obj,
        type: "container",
        id: locationID
    }

    const res = await fetch(
        "/api/storage/add/StorageLocation",
        {
            method:"PUT",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(reqData)
        }
    )

    const data = await res.json();

    window.location.reload();
}
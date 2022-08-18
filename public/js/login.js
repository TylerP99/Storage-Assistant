// Login form handler
// Sends request and displays errors if the login request is not valid

const form = document.querySelector(".login-form");
const emailField = document.querySelector("#email");
const passwordField = document.querySelector("#password");

form.addEventListener("submit", submit_login_request);

async function submit_login_request(event) {
    event.preventDefault();

    const account = {
        email: emailField.value,
        password: passwordField.value
    }

    console.log("Req sent");

    const res = await fetch(
        "/api/account/authenticate",
        {
            method: "POST",
            redirect: "follow",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(account)
        }
    )

    const data = await res.json();

    if(!data.success) {
        return display_errors(data.error);
    }

    window.location.replace("/storage/");
}

function display_errors(error) {
    const errorContainer = document.querySelector(".error-content");
    errorContainer.innerText = error;
}
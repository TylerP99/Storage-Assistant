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

    const res = await fetch(
        "/api/account/authenticate",
        {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(account)
        }
    )

    const data = await res.json();

    console.log(data);
}
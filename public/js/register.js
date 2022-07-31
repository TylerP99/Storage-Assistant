// Client Side Registration Page Handler
console.log("Linked");

// Form Request
const registrationForm = document.querySelector(".registration-form");

const emailField = document.querySelector("#email");
const password1Field = document.querySelector("#password1");
const password2Field = document.querySelector("#password2");

registrationForm.addEventListener("submit", submit_registration_request);

async function submit_registration_request(event) {
    event.preventDefault();

    const account = {
        email: emailField.value,
        password1: password1Field.value,
        password2: password2Field.value
    };

    const res = await fetch(
        "/api/account/create",
        {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({account})
        }
    );

    const data = await res.json();

    console.log(data);
}
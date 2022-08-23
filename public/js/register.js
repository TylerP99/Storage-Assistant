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

    if(!data.valid) {
        return display_errors(data.errors);
    }

    window.location.replace("/login");
}

function display_errors(errors) {
    if(errors.emailInUse) {
        display_email_error("That email is already registered!");
    }

    if(errors.passwordWeak) {
        display_password1_error("Password must be at least 8 characters long!");
    }

    if(errors.passwordNotMatch) {
        display_password2_error("Passwords must match!");
    }
}

function display_email_error(message) {
    const errContainer = document.querySelector(".email-error");
    errContainer.innerText = message;
}

function display_password1_error(message) {
    const errContainer = document.querySelector(".password1-error");
    errContainer.innerText = message;  
}

function display_password2_error(message) {
    const errContainer = document.querySelector(".password2-error");
    errContainer.innerText = message;
}
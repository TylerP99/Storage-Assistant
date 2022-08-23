// Change email form handler
const changeEmailForm = document.querySelector(".change-email-form");

changeEmailForm.addEventListener("submit", change_email);

async function change_email(event) {
    event.preventDefault();

    const form = event.target;

    const reqData = {
        email: form.querySelector("#new-email").value
    };

    const reqLoc = "/api/account/updateEmail";

    const reqType = "PUT";

    const res = await fetch(
        reqLoc,
        {
            method: reqType,
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(reqData)
        }
    );

    const data = await res.json();

    if(!data.valid) {
        return display_email_errors(form, data.errors);
    }

    display_success(form, "Email has been changed!");
}

// Change password form handler
const changePasswordForm = document.querySelector(".change-password-form");

changePasswordForm.addEventListener("submit", change_password);

async function change_password(event) {
    event.preventDefault();

    const form = event.target;

    const reqData = {
        oldPassword: form.querySelector("#old-password").value,
        newPassword1: form.querySelector("#new-password1").value,
        newPassword2: form.querySelector("#new-password2").value
    };

    const reqLoc = "/api/account/updatePassword";

    const reqType = "PUT";

    const res = await fetch(
        reqLoc,
        {
            method: reqType,
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(reqData)
        }
    );

    const data = await res.json();

    console.log(data);

    if(!data.valid) {
        return display_password_errors(form, data.errors);
    }

    display_success(form, "Password has been changed");
}

function display_email_errors(form, errors) {
    const emailErrorContainer = form.querySelector("#email-error");

    if(errors.emailErrors.emailInUse) {
        emailErrorContainer.innerText = "That email is in use"
    }

    if(errors.emailErrors.emailEmpty) {
        emailErrorContainer.innerText = "Email is required"
    }
}

function display_password_errors(form, errors) {
    const oldPasswordError = form.querySelector("#old-password-error");
    const newPassword1Error = form.querySelector("#new-password1-error");
    const newPassword2Error = form.querySelector("#new-password2-error");

    if(errors.passwordErrors.passwordShort) {
        newPassword1Error.innerText = "That password is too short";
    }

    if(errors.passwordErrors.passwordsNotMatch) {
        newPassword2Error.innerText = "Passwords must match";
    }

    if(errors.passwordErrors.oldPasswordIncorrect) {
        oldPasswordError.innerText = "That password is incorrect";
    }
}

function display_success(form, msg) {
    form.querySelector(".success-container").innerText = msg;
}
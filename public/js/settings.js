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
        return;
    }

    window.location.reload();
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

    if(!data.valid) {
        return;
    }

    window.location.reload();
}
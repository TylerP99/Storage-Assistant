// Get logout button (1 per page)
const logoutButton = document.querySelector(".logout-button");

logoutButton.addEventListener("click", logout);

async function logout(e) {
    e.preventDefault();

    const res  = await fetch(
        "/api/account/logout",
        {
            method:"DELETE",
        }
    )

    const data = await res.json();

    console.log(data);

    if(!data.valid) {
        console.log("error");
        return;
    }

    window.location.replace("/logout");
}
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

const formOpenButtons = document.querySelectorAll(".open-button");

formOpenButtons.forEach(x => {
    x.addEventListener("click", open_form);
})

function open_form(event) {
    const overlay = event.target.parentElement.querySelector(".overlay");
    overlay.classList.toggle("hidden");
}


const formOverlays = document.querySelectorAll(".overlay");

formOverlays.forEach(x => x.addEventListener("click", click_off_form));

function click_off_form(event) {
    if(!event.target.closest("form")) {
        event.target.classList.toggle("hidden");
    }
}

// So far so good, adding to all view pages for testing
// Amazing... pushing this to github then refactoring the rest of the code
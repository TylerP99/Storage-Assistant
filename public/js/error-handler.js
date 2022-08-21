// Form error handler
// Validation object is generic, I can make error handler generic as well
/* Current validation object

    const validation = {
            valid: true,
            errors: {
                nameErrors: {
                    undefined: false,
                    tooLarge: false
                },
                descriptionErrors: {
                    tooLarge: false
                },
                lengthErrors: {
                    tooLarge: false
                },
                widthErrors: {
                    tooLarge: false
                },
                heightErrors: {
                    tooLarge: false
                },
                quantityErrors: {
                    tooLarge: false,
                    notPositive: false
                },
                valueErrors: {
                    tooLarge: false
                }
            }
        };

*/

function error_handler(formElement, errors) {
    // Just check for each error, and adjust form accordingly
    // Forms will be changed to have generic input ids rather than object specific ones

    if(errors.nameErrors.undefined) {
        formElement.querySelector("#name").classList.add("error");
        formElement.querySelector("#name-error").innerText = "Name is required";
    }
    else if(errors.nameErrors.tooLarge) {
        formElement.querySelector("#name").classList.add("error");
        formElement.querySelector("#name-error").innerText = "Name is too long";
    }

    if(errors.descriptionErrors.tooLarge) {
        formElement.querySelector("#description").classList.add("error");
        formElement.querySelector("#description-error").innerText = "Description is too long";
    }

    if(errors.lengthErrors.tooLarge) {
        formElement.querySelector("#length").classList.add("error");
        formElement.querySelector("#length-error").innerText = "Length is too long";
    }

    if(errors.widthErrors.tooLarge) {
        formElement.querySelector("#width").classList.add("error");
        formElement.querySelector("#width-error").innerText = "Width is too long";
    }

    if(errors.heightErrors.tooLarge) {
        formElement.querySelector("#height").classList.add("error");
        formElement.querySelector("#height-error").innerText = "Height is too long";
    }

    if(errors.quantityErrors.tooLarge) {
        formElement.querySelector("#quantity").classList.add("error");
        formElement.querySelector("#quantity-error").innerText = "Quantity is too long";
    }

    if(errors.quantityErrors.negative) {
        formElement.querySelector("#quantity").classList.add("error");
        formElement.querySelector("#quantity-error").innerText = "Quantity cannot be negative";
    }

    if(errors.valueErrors.tooLarge) {
        formElement.querySelector("#value").classList.add("error");
        formElement.querySelector("#value-error").innerText = "Value is too long";
    }
}
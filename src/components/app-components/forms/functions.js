// validation function - put setErrors here as a param just when submit the form so I can handle errors
const validation = (firedInput, setErrors) => {
    const errors = {};
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?=.*[a-zA-Z]).{8,}$/
    const nameRegex = /^(?=.*\d)*(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/
    const usernameRegex = /^(?=.*\d)*(?=.*[a-z])(?=.*[a-zA-Z]).{5,}$/
    const webUrlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
    if ("fullName" in firedInput) {
        errors.fullName = valCond(nameRegex.test(firedInput.fullName), "Your Name Must be 8 letters at least")
    }
    if ("username" in firedInput) {
        errors.username = valCond(usernameRegex.test(firedInput.username), "Username must be 5 letters at least")
    }
    if ("email" in firedInput) {
        errors.email = valCond(emailRegex.test(firedInput.email), "Email is badly formatted")
    }
    if ("password" in firedInput) {
        errors.password = valCond(passwordRegex.test(firedInput.password), "Password isn't strong")
    }
    if ("website" in firedInput) {
        errors.website = valCond(firedInput.website == "" || webUrlRegex.test(firedInput.website), "Url is bad formatted")
    }

    setErrors(errors)

    return Object.values(errors).every(input => input == "")
}

// validation condition
const valCond = (condition, errMsg) => {
    return (condition ? "" : `${errMsg}.`)
}

export { validation }
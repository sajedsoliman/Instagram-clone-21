import { useState } from "react"

// material-ui imports
import { makeStyles } from "@material-ui/core"

// component imports
import { useForm } from "../../common-components/useForm"
import Store from "../../common-components/firebase/Store"
import UserForm from "../../common-components/UserForm"
import { auth, db, storage } from '../../common-components/firebase/database'
import { userInitialValues } from "../serviceInfo"
import { validation } from "./functions"

// styles
const useStyles = makeStyles((theme) => ({
}))

function RegisterForm({ handleCloseModal }) {
    const classes = useStyles()

    // State vars


    // import useForm things
    const {
        values: user,
        handleInputsChange,
        validationErrors,
        resetForm,
        setErrors
    } = useForm(userInitialValues, true, validation)

    // import Store component to check if the username is existed or not
    const { loading, signUpUserWithEmail, setLoading } = Store()

    // handle form submit (sign up)
    const handleSignUp = () => {
        if (validation(user, setErrors) && Boolean(user.avatar)) {
            setLoading(true)
            storage.ref(`user_avatars/${user.avatar.name}`)
                .put(user.avatar).then(snapshot => {
                    snapshot.ref.getDownloadURL()
                        .then(url => {
                            handleSignUserUp(url)
                        })
                        // to handle with a notification bar
                        .catch(err => alert(err.message))
                })
        } else {
            handleSignUserUp("")
        }
    }

    // handle sign up (sign up func)
    const handleSignUserUp = (avatarUrl) => {
        signUpUserWithEmail(user, avatarUrl, onSignupUser)

        function onSignupUser(authUser) {
            resetForm()

            if (typeof (handleCloseModal) == "function") {
                handleCloseModal()
            }

            // stop loading
            setLoading(false)
            return authUser.user.updateProfile({
                displayName: user.fullName,
                photoURL: avatarUrl,
            })
        }
    }

    return (
        <div>
            <UserForm user={user} avatarLoadingProgress={loading}
                validationErrors={validationErrors} actionHandler={handleSignUp}
                handleChange={handleInputsChange} action={"register"} />
        </div>
    )
}

export default RegisterForm
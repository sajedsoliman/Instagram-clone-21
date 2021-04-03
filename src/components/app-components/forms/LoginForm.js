import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// material-ui imports
import { Button, makeStyles } from "@material-ui/core"

// component imports
import UserForm from "../../common-components/user-related/UserForm"
import Store from "../../common-components/firebase/Store"
import CompleteSignIn from './CompleteSignIn'

// Hooks
import { useForm } from "../../common-components/hooks/useForm"

// Utilities
import IF from '../../common-components/utilities/IF'

// Service
import { auth, firebase } from '../../common-components/firebase/database'
import { userInitialValues } from '../serviceInfo'


// styles
const useStyles = makeStyles((theme) => ({
    googleSignUpBtn: {
        marginTop: 20
    }
}))

function LoginForm({ handleLoginModalClose }) {
    const classes = useStyles()

    // Router imports
    const history = useHistory()
    const location = useLocation()
    const from = location.state?.from || { pathname: "/" }

    // State vars
    const [googleLastStep, setGoogleLastStep] = useState(false)
    const [googleAuthUser, setGoogleAuthUser] = useState(null)

    // import useForm things
    const {
        values: user,
        handleInputsChange,
        validationErrors
    } = useForm(userInitialValues, false)

    // Import Store component to check the ability and to sign in users
    const { isUserExisted, handleSignIn } = Store()

    // Login with google
    const handleSignInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider()

        auth.signInWithPopup(provider)
            .then(async authUser => {
                // Check if the user is already existed or not
                if (await isUserExisted(authUser.user.uid)) {
                    if (typeof (handleLoginModalClose) == "function") {
                        handleLoginModalClose()
                    }

                    history.replace(from, { user: true })
                } else {
                    setGoogleAuthUser(authUser.user)
                    setGoogleLastStep(true)
                }
            }).catch(err => alert(err.message))
    }

    // Handle login with either email or username
    const handleSignInWithPasswordAndEmail = () => {
        // Decide whether the user has entered their email or username
        // test it on a regex for emails
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        const isEmail = emailRegex.test(user.loginInput)

        handleSignIn(isEmail, user.password, user.loginInput, signInCallback, from)

        function signInCallback() {
            // Close the login modal
            if (typeof (handleLoginModalClose) == "function") {
                handleLoginModalClose()
            }
            // if we have from go to it
        }
    }

    // Google last step component
    const googleLastStepRender = (
        <CompleteSignIn authUser={googleAuthUser} closeDialog={handleLoginModalClose} />
    )

    return (
        <IF condition={!googleLastStep} elseChildren={googleLastStepRender}>
            <div>
                <UserForm validationErrors={validationErrors} user={user}
                    actionHandler={handleSignInWithPasswordAndEmail} handleChange={handleInputsChange} action={"login"} />

                <Button className={classes.googleSignUpBtn} fullWidth onClick={handleSignInWithGoogle} variant="contained" color="default" startIcon={<i className="fab fa-google" />}>
                    Login With Google</Button>
            </div>
        </IF>
    )
}

export default LoginForm

import { useHistory, useLocation } from 'react-router-dom'

// material-ui imports
import { Button, makeStyles } from "@material-ui/core"

// component imports
import { useForm } from "../../common-components/useForm"
import UserForm from "../../common-components/user-related/UserForm"
import Store from "../../common-components/firebase/Store"

// Service
import { auth, firebase } from '../../common-components/firebase/database'
import { validation } from "./functions"
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
    // import useForm things
    const {
        values: user,
        handleInputsChange,
        validationErrors
    } = useForm(userInitialValues, false)

    // Login with google
    const handleSignInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider()

        auth.signInWithPopup(provider)
            .then(authUser => {
                if (typeof (handleLoginModalClose) == "function") {
                    handleLoginModalClose()
                }

                history.replace(from)
            }).catch(err => {
                window.location = "/"
            })
    }

    // Import Store component to sign in users
    const { handleSignIn } = Store()

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

    return (
        <div>
            <UserForm validationErrors={validationErrors} user={user}
                actionHandler={handleSignInWithPasswordAndEmail} handleChange={handleInputsChange} action={"login"} />

            {/* <Button className={classes.googleSignUpBtn} fullWidth onClick={handleSignInWithGoogle} variant="contained" color="default" startIcon={<i className="fab fa-google" />
            }>Login With Google</Button> */}
        </div>
    )
}

export default LoginForm

import { useEffect } from "react"

import { useHistory } from "react-router"
// UI imports
import { Container } from "@material-ui/core"

// Component imports
import AppPage from "../AppPage"
import LoginForm from "../../forms/LoginForm"

// Contexts
import { AuthedUser } from "../../../user-context/AuthedUserContext"


function Login() {
    // Get logged user to redirect if the user is already logged in
    const loggedUser = AuthedUser()

    // Router
    const history = useHistory()

    // useEffect to check if the user is exited or not on when user state changes
    useEffect(() => {
        // Check if the user is exist or not
        if (loggedUser) {
            // If not exist go back to home page
            history.replace("/")
        }
    }, [loggedUser])

    if (loggedUser) return null
    return (
        <AppPage>
            <Container maxWidth="xs">
                <LoginForm />
            </Container>
        </AppPage>
    )
}

export default Login
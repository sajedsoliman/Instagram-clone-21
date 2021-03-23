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
    return (
        <AppPage>
            <Container maxWidth="xs">
                <LoginForm />
            </Container>
        </AppPage>
    )
}

export default Login

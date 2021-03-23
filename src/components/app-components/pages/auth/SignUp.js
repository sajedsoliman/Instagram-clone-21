import { useEffect } from "react"
import { useHistory } from "react-router"

// UI imports
import { Container } from "@material-ui/core"

// Contexts
import { AuthedUser } from "../../../user-context/AuthedUserContext"

// Component imports
import AppPage from "../AppPage"
import RegisterForm from "../../forms/RegisterForm"



function SignUp() {

    return (
        <AppPage>
            <Container maxWidth="sm">
                <RegisterForm />
            </Container>
        </AppPage>
    )
}

export default SignUp

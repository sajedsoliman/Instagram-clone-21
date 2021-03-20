// Router
import { Redirect, Route } from 'react-router-dom'

// Contexts - to get the already logged user
import { AuthedUser } from '../../user-context/AuthedUserContext'

function AuthRoute({ children, ...other }) {
    const loggedUser = AuthedUser()

    return (
        <Route {...other} render={({ location }) =>
            loggedUser && loggedUser.uid ? (
                children
            ) : (
                <Redirect to={{
                    pathname: "/login",
                    state: { from: location }
                }} />
            )
        } />
    )
}

export default AuthRoute

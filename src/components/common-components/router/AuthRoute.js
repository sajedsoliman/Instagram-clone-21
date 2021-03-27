// Router
import { Redirect, Route } from 'react-router-dom'

// Contexts
import { AuthedUser } from '../../user-context/AuthedUserContext'

// bring the auth function to check users status
import { auth } from '../firebase/database'

function AuthRoute({ children, ...other }) {
    const user = AuthedUser()

    return (
        <Route {...other} render={({ location }) => {
            const isUser = location.state && location.state.user
            return !(user == "no user") || isUser ? (
                children
            ) : (
                <Redirect to={{
                    pathname: "/login",
                    state: { from: location }
                }} />
            )
        }} />
    )
}

export default AuthRoute

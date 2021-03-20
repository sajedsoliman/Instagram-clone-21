// Router
import { Redirect, Route } from 'react-router-dom'

// bring the auth function to check users status
import { auth } from '../firebase/database'

function AuthRoute({ children, ...other }) {

    return (
        <Route {...other} render={({ location }) =>
            auth.currentUser ? (
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

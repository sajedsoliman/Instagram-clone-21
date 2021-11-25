// Router
import { Redirect, Route } from "react-router-dom";

// Contexts - to get the already logged user
import { AuthedUser } from "../../user-context/AuthedUserContext";

function UnAuthRoute({ children, ...other }) {
	const loggedUser = AuthedUser();

	return (
		<Route
			{...other}
			render={({ location }) =>
				loggedUser == "no user" ? (
					children
				) : (
					<Redirect
						to={{
							pathname: "/",
						}}
					/>
				)
			}
		/>
	);
}

export default UnAuthRoute;

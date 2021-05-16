import { useEffect, useState } from "react";

// contexts
import { AuthedUser } from "../../../../user-context/AuthedUserContext";

// Material-Ui imports
import { makeStyles } from "@material-ui/core";

// component imports
import CommonButton from "../../../../common-components/CommonButton";
import Store from "../../../../common-components/firebase/Store";
import FollowedUserActions from "./FollowedUserActions";

// styles
const useStyles = makeStyles((theme) => ({}));

function NormalUserActions({ user, fullWidthFollowButton = false }) {
	const loggedUser = AuthedUser();
	const classes = useStyles();

	// destructuring props
	const { id } = user;

	// State vars
	const [followers, setFollowers] = useState([]);

	// imports Store functions
	const { getUserFollowers, handleFollow } = Store();

	// fetch/import logged user followers
	useEffect(() => {
		getUserFollowers(id, setFollowers);
	}, []);

	// handle follow a user
	const followUserHandler = () => {
		handleFollow(loggedUser, user);
	};

	// Some checks
	// if you have followed or haven't
	const followerObj = followers.find((follower) => follower.id == loggedUser.id);
	const isFollowed = Boolean(followerObj);

	// Render the app actions depending on followed or not
	let actions = (
		<CommonButton
			fullWidth={fullWidthFollowButton}
			onClick={followUserHandler}
			text="Follow"
			variant="contained"
		/>
	);

	if (isFollowed) actions = <FollowedUserActions user={user} />;

	return actions;
}

export default NormalUserActions;

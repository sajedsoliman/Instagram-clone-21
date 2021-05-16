import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

// Material-Ui imports
import {
	Avatar,
	CardActions,
	CardContent,
	Container,
	Divider,
	Grid,
	Link,
	makeStyles,
	Paper,
	Typography,
} from "@material-ui/core";
import CameraAltOutlined from "@material-ui/icons/CameraAltOutlined";

// Contexts
import { AuthedUser } from "../../user-context/AuthedUserContext";

// utilities
import IF from "../utilities/IF";

// component imports
import UserStatistics from "./../../app-components/pages/user-profile/user-details-section/UserStatistics";
import NormalUserActions from "../../app-components/pages/user-profile/user-details-section/NormalUserActions";
import Store from "../firebase/Store";
import UserPost from "../post-components/UserPost";

// Contexts
const useStyles = makeStyles((theme) => ({
	wrapper: {
		flexDirection: "column",
		minWidth: 400,
		paddingBottom: 2,
		borderRadius: 22,
		boxShadow: "0 0 3px 0 rgba(0,0,0,0.1)",
	},
	info: {
		display: "flex",
		flexDirection: "column",
	},
	avatar: {},
	actions: {
		"& > div": {
			width: "100%",

			"& button": {
				flexGrow: 1,
			},
		},
	},
	msgWrapper: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		width: "100%",
		minHeight: 80,
		padding: "10px 0",
	},
	iconWrapper: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		border: "1px solid black",
		borderRadius: 100,
		width: 50,
		height: 50,
		marginBottom: 5,
		"& .MuiSvgIcon-root": {
			fontSize: 28,
			margin: 0,
			padding: 0,
		},
	},
}));

// styles

function UserProfileOverview({ user }) {
	const classes = useStyles();
	const loggedUser = AuthedUser();

	// Destructuring props
	const { avatar, fullName, username, id } = user;

	// State vars
	const [latestPosts, setLatestPosts] = useState([]);

	// Import Store component to get latest posts
	const { getLatestUserPosts, loading } = Store();

	// Fetch the user latest 3 videos
	useEffect(() => {
		// get latest 3 videos
		getLatestUserPosts(id, 3, setLatestPosts);
	}, []);

	// map through posts
	const mappedPosts = latestPosts.map((pst) => {
		const { id: docId, post } = pst;
		return <UserPost key={docId} post={post} id={docId} userId={id} cardHeight={130} />;
	});

	// When a user doesn't have any posts
	const noPostsMessage = (
		<div className={classes.msgWrapper}>
			<div className={classes.iconWrapper}>
				<CameraAltOutlined />
			</div>
			<Typography variant="body2">No posts for this user</Typography>
		</div>
	);

	if (loading) return null;
	return (
		<Paper variant="outlined" className={classes.wrapper}>
			{/* main Info - avatar - name - site */}
			<CardContent>
				<Grid container>
					<Grid item xs={2}>
						<Avatar className={classes.avatar} src={avatar}>
							{fullName[0]}
						</Avatar>
					</Grid>
					<Grid item xs={10}>
						<div className={classes.info}>
							<Typography variant="subtitle2">
								<Link color="inherit" to={`/${username}`} component={RouterLink}>
									{username}
								</Link>
							</Typography>
							<Typography color="textSecondary">{fullName}</Typography>
						</div>
					</Grid>
				</Grid>
			</CardContent>

			<Divider />

			{/* their statistics */}
			<Container>
				<UserStatistics userId={id} username={username} />
			</Container>

			<Divider />

			{/* latest 3 posts */}
			<Grid container>
				<IF condition={mappedPosts.length !== 0} elseChildren={noPostsMessage}>
					{mappedPosts}
				</IF>
			</Grid>

			{/* actions with the user - message - follow or un follow */}
			<CardActions className={classes.actions}>
				<IF condition={loggedUser != "no user" && loggedUser.id !== id}>
					<NormalUserActions fullWidthFollowButton={true} user={user} />
				</IF>
			</CardActions>
		</Paper>
	);
}

export default UserProfileOverview;

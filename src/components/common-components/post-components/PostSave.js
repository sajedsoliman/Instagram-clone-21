import { useEffect, useState } from "react";

// Material-Ui imports
import { makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";

// component imports
import { AuthedUser } from "../../user-context/AuthedUserContext";
import { useAlert } from "../../notification-context/NotificationContext";
import { db, firebase } from "../../common-components/firebase/database";
import Store from "../firebase/Store";

// Utilities
import IF from "../utilities/IF";

const SAVE_COLOR = "rgb(255 188 0 / 78%)";

const useStyles = makeStyles((theme) => ({
	postActionContainer: {
		display: "flex",
		alignItems: "center",

		"& i": {
			marginRight: 6,
		},
	},
	saveIcon: {
		fontSize: 20,
		cursor: "pointer",
		transition: theme.transitions.create(["color", "transform"], { duration: 100 }),

		"&.active": {
			color: SAVE_COLOR,
			transform: "scale(1.1)",
		},
	},
}));

function PostSave(props) {
	const classes = useStyles();
	const loggedUser = AuthedUser();
	const processSettings = useAlert();

	// destructuring through props
	const { user, docId, post } = props;

	// State vars
	const [isSaved, setSaved] = useState(false);

	// set an event listener for likes only!
	// docId as a dep => to change the listener(onSnapshot) every time the post changes
	useEffect(() => {
		db.collection("members")
			.doc(loggedUser.id)
			.collection("saved_posts")
			.doc(docId)
			.onSnapshot((snapshot) => {
				setSaved(snapshot.exists);
			});
	}, [docId]);

	// handling like ability
	const handleToggleSave = () => {
		// Handle send a notification
		if (loggedUser != "no user") {
			if (loggedUser.uid != user.id) {
				db.collection("members")
					.doc(loggedUser.id)
					.collection("saved_posts")
					.doc(docId)
					.get()
					.then((savedPostDoc) => {
						if (!savedPostDoc.exists) {
							// if doesn't exist Add it (save)
							savedPostDoc.ref.set({
								...post,
							});
						} else {
							// If does exist delete it (unSave)
							savedPostDoc.ref.delete();
						}
					})
					.then((_) => processSettings("success", "Post Saved"))
					.catch((err) => processSettings("error", err.message));
			} else {
				// user owns the post
				processSettings("error", "You cannot save your own posts");
			}
		} else {
			processSettings("warning", "Login to save the post");
		}
	};

	// label styles based on isSaved or not
	const labelStyles = {
		color: isSaved ? SAVE_COLOR : "black",
	};

	// To get likes count on the post and get some liker names to show when hover over
	return (
		<Typography className={classes.postActionContainer}>
			<i /* put (fas) here just to fill the heart */
				className={clsx(classes.saveIcon, "far fa-star", { "active fas": isSaved })}
				onClick={handleToggleSave}
			></i>
			<span style={labelStyles}>
				<IF condition={isSaved} elseChildren={"Save"}>
					Saved
				</IF>
			</span>
		</Typography>
	);
}

export default PostSave;

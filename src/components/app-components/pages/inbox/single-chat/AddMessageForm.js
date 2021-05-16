import { useEffect, useRef, useState } from "react";

// UI imports
import {
	Button,
	CardActions,
	Grow,
	IconButton,
	InputBase,
	makeStyles,
	Slide,
	Typography,
} from "@material-ui/core";
import { Favorite } from "@material-ui/icons";

// Component imports
import Store from "../../../../common-components/firebase/Store";
import IF from "../../../../common-components/utilities/IF";

// Contexts
import { AuthedUser } from "../../../../user-context/AuthedUserContext";

// Typing audio file (like messenger)
import typingAudio from "../static/typing-audio.mp3";

// style staff
const useStyles = makeStyles((theme) => ({
	wrapper: {
		boxSizing: "border-box",
		height: 65,
		position: "relative",
	},
	formWrapper: {
		width: "100%",
		padding: "10px 15px",
		borderRadius: 25,
		border: "1px solid rgba(0,0,0,.24)",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginLeft: "0 !important",
	},
	submitBtn: {
		backgroundColor: "#31B8FA",
		color: "white",

		"&:hover": {
			backgroundColor: "transparent",
			border: "1px solid #31B8FA",
			color: "black",
		},
		"&.Mui-disabled": {
			backgroundColor: "rgb(0 171 255 / 48%)",
			color: "rgb(255 255 255 / 63%)",
		},
	},
	input: {
		flexGrow: 1,
	},
	typingMsg: {
		position: "absolute",
		top: -30,
		left: 30,
	},
	likeIcon: {
		fontSize: 30,
		cursor: "pointer",
	},
}));

function AddMessageForm({ chatId, senToId, loggedUserId, chatTyping }) {
	const classes = useStyles();
	const loggedUser = AuthedUser();

	// Refs
	const typingAudioRef = useRef();
	const newMessageAudioRef = useRef();

	// State vars
	const [messageText, setMessageText] = useState("");

	// Import Store component
	const { handleSendMessage, handleOtherUserTyping } = Store();

	// To listen to other user typing
	useEffect(() => {
		if (chatTyping) {
			typingAudioRef.current.play();
		} else typingAudioRef.current.pause();
	}, [chatTyping]);

	// Listener for other user typing
	useEffect(() => {
		// handle toggle (typing) on the other user
		handleOtherUserTyping(chatId, senToId, messageText);
	}, [messageText, chatTyping]);

	// Handle change message text
	const handleChangeMsgText = (e) => {
		setMessageText(e.target.value);
	};

	// handle submit the form
	const handleSubmit = (e) => {
		e.preventDefault();
		// empty the input
		setMessageText("");

		// Handle add it to db
		handleSendMessage(chatId, loggedUserId, loggedUser.username, senToId, messageText);

		// Play some audio
		// newMessageAudioRef.current.play()
	};

	// handle send a like
	const handleSendLike = () => {
		handleSendMessage(chatId, loggedUserId, loggedUser.username, senToId, "/like-reserved");
	};

	// Send like button
	const sendLikeButton = (
		<Favorite onClick={handleSendLike} className={classes.likeIcon} color="secondary" />
	);

	return (
		<CardActions className={classes.wrapper}>
			{/* Typing... */}
			{!chatTyping ? null : (
				<Slide direction="right" in={true}>
					<Typography className={classes.typingMsg} variant="body2" color="textSecondary">
						Typing...
					</Typography>
				</Slide>
			)}
			<form onSubmit={handleSubmit} className={classes.formWrapper}>
				<InputBase
					value={messageText}
					onChange={handleChangeMsgText}
					className={classes.input}
					placeholder="Your message.."
				/>
				<IF condition={messageText !== ""} elseChildren={sendLikeButton}>
					<Button
						disabled={messageText == ""}
						disableRipple
						variant="text"
						size="small"
						type="submit"
						className={classes.submitBtn}
					>
						Send
					</Button>
				</IF>
			</form>

			{/* audio for typing */}
			<audio
				ref={typingAudioRef}
				src="https://firebasestorage.googleapis.com/v0/b/insta-clone-2-4dd4b.appspot.com/o/typing-audio.mp3?alt=media&token=5f88dc3d-1fbc-4145-a092-625b1b3a86da"
			></audio>

			{/* audio for a new message from the logged user */}
			<audio
				ref={newMessageAudioRef}
				src="https://firebasestorage.googleapis.com/v0/b/insta-clone-2-4dd4b.appspot.com/o/10convert.com_Facebook-messager-Sound-Effect-New-2020-Sound-For-free-Download-Now_9Y0D9zkAvzM%20(1).mp3?alt=media&token=c9d8b56a-7dac-4888-a2a6-44ff71946ec5"
			></audio>
		</CardActions>
	);
}

export default AddMessageForm;

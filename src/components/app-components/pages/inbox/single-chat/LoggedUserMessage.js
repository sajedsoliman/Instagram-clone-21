// UI imports
import { Grow, makeStyles, Typography } from "@material-ui/core";

// Icons
import { Favorite, MoreHoriz } from "@material-ui/icons";

// style staff
const useStyles = makeStyles((theme) => ({
	message: {
		marginLeft: "auto",
		background: "rgb(232 232 232)",
		color: "rgb(21 21 21)",
		padding: 10,
		borderRadius: 20,
		maxWidth: "50%",
		wordBreak: "break-word",
		position: "relative",
	},
	optionsIcon: {
		position: "absolute",
		left: -30,
		top: "50%",
		transform: "translateY(-50%)",
		cursor: "pointer",

		"&:hover": {
			opacity: 0.7,
		},
	},
	likeIcon: {
		fontSize: 30,
		marginLeft: "auto",
	},
}));

function LoggedUserMessage({ messageBody, msgOptions, msgSeen }) {
	const classes = useStyles();

	return (
		<>
			{messageBody === "/like-reserved" ? (
				<Favorite color="secondary" className={classes.likeIcon} />
			) : (
				<Typography className={classes.message}>
					{messageBody}
					{msgOptions && <MoreHoriz className={classes.optionsIcon} />}
				</Typography>
			)}
		</>
	);
}

export default LoggedUserMessage;

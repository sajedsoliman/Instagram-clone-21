// Material-Ui import
import { Avatar, Box, makeStyles, Typography } from "@material-ui/core";

// component imports
import { AuthedUser } from "../../user-context/AuthedUserContext";

// styles
const useStyles = makeStyles((theme) => ({
	avatar: {
		width: 70,
		height: 70,
	},
	infoBox: {
		marginLeft: 20,
	},
}));

function UserInfo() {
	const classes = useStyles();
	const loggedUser = AuthedUser();

	const { avatar, fullName, username } = loggedUser;

	return (
		<Box display="flex" alignItems="center" flexDirection="row" height="100%" marginBottom={3}>
			<Avatar className={classes.avatar} src={avatar}>
				{fullName[0]}
			</Avatar>
			<Box className={classes.infoBox}>
				<Typography className={classes.fullName} variant="h6" color="textPrimary">
					{fullName}
				</Typography>
				<Typography className={classes.username} variant="body2" color="textSecondary">
					{username}
				</Typography>
			</Box>
		</Box>
	);
}

export default UserInfo;

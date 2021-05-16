// material-ui imports
import { Button, CircularProgress, Grid, makeStyles, Typography } from "@material-ui/core";

// component imports
import Controls from "../controls/Controls";

// Firebase imports
import { auth } from "../firebase/database";

// Hooks
import { Form } from "../hooks/useForm";

// Contexts
import { useAlert } from "../../notification-context/NotificationContext";

// styles
const useStyles = makeStyles((theme) => ({
	form: {
		display: "flex",
		flexDirection: "column",
		marginBottom: 15,
	},
	logo: {
		objectFit: "contain",
		width: "100%",
		height: 35,
		marginBottom: 14,
	},
	filePondRoot: {},
	actionBtn: {
		marginTop: 15,
	},
	forgetPassword: {
		cursor: "pointer",
		marginTop: 10,
	},
	progressButtonWrapper: {
		position: "relative",
	},
	circularProgress: {
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -5,
		marginLeft: -13,
	},
}));

function UserForm(props) {
	const classes = useStyles();
	const processSettings = useAlert();

	// destructuring props
	const {
		user,
		handleChange: handleInputsChange,
		action,
		actionHandler,
		validationErrors,
		avatarLoadingProgress,
	} = props;

	// handle add avatar
	const handleAddAvatar = (file) => {
		const target = {
			value: file,
			name: "avatar",
		};
		handleInputsChange({ target });
	};

	// handle send a new password link
	const handleForgotPassword = () => {
		if (user.email == "") {
			processSettings("warning", "Type in your email address");
		} else
			auth
				.sendPasswordResetEmail(user.email)
				.then((value) => {
					processSettings("info", "Reset password link has sent");
				})
				.catch((err) => processSettings("error", err.message));
	};

	// input common props
	const inputCommonProps = (label, name, value) => ({
		label,
		inputChange: handleInputsChange,
		value: value,
		name,
	});

	return (
		<Form onSubmit={actionHandler} className={classes.form}>
			<img
				className={classes.logo}
				src="https://i.ibb.co/Bqm1g6x/735145cfe0a4.png"
				alt="instagram"
			/>

			{action == "register" && (
				// Merge between full name and avatar in a good shape
				<>
					<Grid container alignItems="center" spacing={2}>
						<Grid item xs={8}>
							<Controls.TextInput
								validationError={validationErrors.fullName}
								{...inputCommonProps("Full Name", "fullName", user.fullName)}
							/>
						</Grid>
						<Grid item xs={4} justify="center" style={{ display: "flex" }}>
							{/* handleUploadAvatar(file.file) */}
							<Controls.FilePondCircular
								addFileHandle={(err, file) => handleAddAvatar(file.file)}
								rootClassName={classes.filePondRoot}
								label="Your Image"
								size="small"
							/>
						</Grid>
					</Grid>

					{/* Email input - for just register */}
					<Controls.TextInput
						validationError={validationErrors.email}
						{...inputCommonProps("Email Address", "email", user.email)}
					/>
				</>
			)}

			{/* Input for email or username */}
			{action == "login" && (
				<Controls.TextInput
					{...inputCommonProps("Email or Username", "loginInput", user.loginInput)}
				/>
			)}

			{/* Username input */}
			{action == "register" && (
				<Controls.TextInput
					validationError={validationErrors.username}
					{...inputCommonProps("Username", "username", user.username)}
				/>
			)}

			{/* password input */}
			<Controls.PasswordInput
				validationError={validationErrors.password}
				{...inputCommonProps("Password", "password", user.password)}
			/>

			{/* handle forget password */}
			{action == "login" && (
				<Typography
					variant="body2"
					className={classes.forgetPassword}
					onClick={handleForgotPassword}
				>
					Forgot Password
				</Typography>
			)}

			<div className={classes.progressButtonWrapper}>
				<Button
					type="submit"
					fullWidth
					disabled={avatarLoadingProgress}
					className={classes.actionBtn}
					color={`${action == "login" ? "primary" : "secondary"}`}
					variant="outlined"
				>
					{action}
				</Button>

				{avatarLoadingProgress && (
					<CircularProgress size={24} className={classes.circularProgress} />
				)}
			</div>
		</Form>
	);
}

export default UserForm;

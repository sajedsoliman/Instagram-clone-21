import { useState } from "react";

// material-ui imports
import { makeStyles } from "@material-ui/core";

// component imports
import UserForm from "../../common-components/user-related/UserForm";
import Store from "../../common-components/firebase/Store";

// Hooks
import { useForm } from "../../common-components/hooks/useForm";

// service
import { validation } from "./functions";
import { userInitialValues } from "../serviceInfo";
import { storage } from "../../common-components/firebase/database";

// styles
const useStyles = makeStyles((theme) => ({}));

function RegisterForm({ handleCloseModal }) {
	const classes = useStyles();

	// import useForm things
	const {
		values: user,
		handleInputsChange,
		validationErrors,
		resetForm,
		setErrors,
	} = useForm(userInitialValues, true, validation);

	// import Store component to check if the username is existed or not
	const { loading, signUpUserWithEmail, setLoading } = Store();

	// handle form submit (sign up)
	const handleSignUp = (e) => {
		e.preventDefault();

		if (validation(user, setErrors) && Boolean(user.avatar)) {
			setLoading(true);
			storage
				.ref(`user_avatars/${user.avatar.name}`)
				.put(user.avatar)
				.then((snapshot) => {
					snapshot.ref
						.getDownloadURL()
						.then((url) => {
							handleSignUserUp(url);
						})
						// to handle with a notification bar
						.catch((err) => alert(err.message));
				});
		} else {
			handleSignUserUp("");
		}
	};

	// handle sign up (sign up func)
	const handleSignUserUp = (avatarUrl) => {
		if (validation(user, setErrors)) {
			signUpUserWithEmail(user, avatarUrl, onSignupUser);
		} else return;

		function onSignupUser(authUser) {
			resetForm();

			if (typeof handleCloseModal == "function") {
				handleCloseModal();
			}
		}
	};

	return (
		<div>
			<UserForm
				user={user}
				avatarLoadingProgress={loading}
				validationErrors={validationErrors}
				actionHandler={handleSignUp}
				handleChange={handleInputsChange}
				action={"register"}
			/>
		</div>
	);
}

export default RegisterForm;

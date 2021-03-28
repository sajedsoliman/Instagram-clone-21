import { useState } from "react";
import { useHistory, useLocation } from "react-router";

// Material-UI
import { Button, makeStyles, Typography } from "@material-ui/core";

// contexts

// component imports
import Controls from "../../common-components/controls/Controls";
import Store from "../../common-components/firebase/Store";

// Styles
const useStyles = makeStyles(theme => ({
    header: {
        marginBottom: 15,
    },
    submitBtn: {
        display: "block",
        width: "100%",
        marginTop: 20
    }
}))


function GoogleComplete({ authUser, closeDialog }) {
    const classes = useStyles()

    // Router
    const history = useHistory()
    const location = useLocation()
    const from = location.state?.from || { pathname: "/" }

    // State vars
    const [username, setUsername] = useState("")

    // Import Store component to check the ability and add the user to database
    const { isUsernameExisted, AddUserToDB, AddToAlgolia } = Store()

    // handle username changing
    const usernameChangeHandler = (e) => {
        setUsername(e.target.value)
    }

    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Check if the entered username is existed or not
        const isAvailable = await isUsernameExisted(username)

        if (isAvailable) {
            // Add the user to db
            const userToDB = {
                email: authUser.email,
                username,
                fullName: authUser.displayName,
                bio: "",
                website: "",
                id: authUser.uid,
                avatar: authUser.photoURL,
            }
            AddUserToDB(userToDB)

            // Add them to algolia
            const userToAlgolia = { username, fullName: authUser.displayName, email: authUser.email }
            AddToAlgolia(userToAlgolia, authUser.photoURL)

            // after add them
            closeDialog()
            history.replace(from, { user: true })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" align="center" className={classes.header}>Last Step</Typography>
            <Controls.TextInput
                value={username}
                label="Username"
                inputChange={usernameChangeHandler} />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitBtn}>Finish</Button>
        </form>
    )
}

export default GoogleComplete

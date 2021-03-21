import { useState } from 'react'

// UI imports
import { Button, CardActions, InputBase, makeStyles } from '@material-ui/core'

// Component imports
import Store from '../../../../common-components/firebase/Store'

// Contexts
import { AuthedUser } from '../../../../user-context/AuthedUserContext'


// style staff
const useStyles = makeStyles(theme => ({
    wrapper: {
        boxSizing: "border-box",
        height: 65,
    },
    formWrapper: {
        width: "100%",
        padding: "10px 15px",
        borderRadius: 25,
        border: "1px solid rgba(0,0,0,.24)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    submitBtn: {
        backgroundColor: "#31B8FA",
        color: "white",

        "&:hover": {
            backgroundColor: "transparent",
            border: "1px solid #31B8FA",
            color: "black"
        }
    },
    input: {
        flexGrow: 1
    }
}))

function AddMessageForm({ chatId, senToId, loggedUserId }) {
    const classes = useStyles()
    const loggedUser = AuthedUser()

    // State vars
    const [messageText, setMessageText] = useState("")

    // Handle change message text
    const handleChangeMsgText = (e) => {
        setMessageText(e.target.value)
    }

    // Import Store component
    const { handleSendMessage } = Store()

    // handle submit the form
    const handleSubmit = (e) => {
        e.preventDefault()
        // empty the input
        setMessageText("")

        // Handle add it to db
        handleSendMessage(chatId, loggedUserId, loggedUser.username, senToId, messageText)

    }

    return (
        <CardActions className={classes.wrapper}>
            <form onSubmit={handleSubmit} className={classes.formWrapper}>
                <InputBase
                    value={messageText}
                    onChange={handleChangeMsgText}
                    className={classes.input}
                    placeholder="Your message.." />
                <Button
                    disabled={messageText == ""}
                    disableRipple
                    variant="text"
                    size="small"
                    type="submit"
                    className={classes.submitBtn}>
                    Send
                </Button>
            </form>
        </CardActions>
    )
}

export default AddMessageForm

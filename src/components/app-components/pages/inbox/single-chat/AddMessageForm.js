import { useEffect, useRef, useState } from 'react'

// UI imports
import { Button, CardActions, Grow, InputBase, makeStyles, Slide, Typography } from '@material-ui/core'

// Component imports
import Store from '../../../../common-components/firebase/Store'

// Contexts
import { AuthedUser } from '../../../../user-context/AuthedUserContext'

// Typing audio file (like messenger)
import typingAudio from '../static/typing-audio.mp3'

// style staff
const useStyles = makeStyles(theme => ({
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
            color: "black"
        },
        "&.Mui-disabled": {
            backgroundColor: "rgb(0 171 255 / 48%)",
            color: "rgb(255 255 255 / 63%)"
        }
    },
    input: {
        flexGrow: 1
    },
    typingMsg: {
        position: "absolute",
        top: -30,
        left: 30
    }
}))

function AddMessageForm({ chatId, senToId, loggedUserId, chatTyping }) {
    const classes = useStyles()
    const loggedUser = AuthedUser()

    // Refs
    const audioRef = useRef()

    // State vars
    const [messageText, setMessageText] = useState("")

    // Import Store component
    const { handleSendMessage, handleOtherUserTyping } = Store()

    // Listener for other user typing
    useEffect(() => {
        if (messageText != "")
            audioRef.current.play()
        else
            audioRef.current.pause()

        // handle toggle (typing) on the other user
        handleOtherUserTyping(chatId, senToId, messageText)
    }, [messageText])

    // Handle change message text
    const handleChangeMsgText = (e) => {
        setMessageText(e.target.value)
    }

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
            {/* Typing... */}
            {!chatTyping ? null :
                <Slide direction="right" in={true}>
                    <Typography className={classes.typingMsg} variant="body2" color="textSecondary">Typing...</Typography>
                </Slide>
            }
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

            {/* audio for typing */}
            <audio ref={audioRef} src={typingAudio}></audio>
        </CardActions>
    )
}

export default AddMessageForm

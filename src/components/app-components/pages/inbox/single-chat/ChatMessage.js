// UI imports
import { makeStyles } from '@material-ui/core'

// Contexts
import { AuthedUser } from '../../../../user-context/AuthedUserContext'

// Component imports
import LoggedUserMessage from './LoggedUserMessage'
import SenToMessage from './SenToMessage'

// style staff
const useStyles = makeStyles(theme => ({
    msgWrapper: {
        display: "flex",

        "& > *": {
            maxWidth: "50%"
        }
    }
}))


function ChatMessage({ message }) {
    const loggedUser = AuthedUser()
    const classes = useStyles()

    // Check if the message is yours
    const isYours = message.senderId == loggedUser.uid

    return (
        <div className={classes.msgWrapper}>
            {
                isYours ? (
                    <LoggedUserMessage messageBody={message.body} />
                ) : (
                    <SenToMessage messageBody={message.body} />
                )
            }
        </div>
    )
}

export default ChatMessage

// UI imports
import { Grow, makeStyles } from '@material-ui/core'

// Contexts
import { AuthedUser } from '../../../../user-context/AuthedUserContext'

// Component imports
import LoggedUserMessage from './LoggedUserMessage'
import SenToMessage from './SenToMessage'

// style staff
const useStyles = makeStyles(theme => ({
    msgWrapper: {
        display: "flex",
        marginBottom: 10,
    }
}))


function ChatMessage({ message, senToUser }) {
    const loggedUser = AuthedUser()
    const classes = useStyles()

    // Check if the message is yours
    const isYours = message.senderId == loggedUser.uid

    return (
        <Grow in={true}>
            <div className={classes.msgWrapper}>
                {
                    isYours ? (
                        <LoggedUserMessage messageBody={message.body} />
                    ) : (
                        <SenToMessage senToUser={senToUser} messageBody={message.body} />
                    )
                }
            </div>
        </Grow>
    )
}

export default ChatMessage
